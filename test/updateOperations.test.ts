import { ApiClient } from '../src/ApiClient'
import type { UpdateFinanceOperation } from '../src/FinanceOperation'
import { RecordType } from '../src/messages/getRecordList'
import type { SetRecordListSoapList } from '../src/messages/setRecordList'

function stubbedClient(): { client: ApiClient; sent: SetRecordListSoapList[] } {
  const client = new ApiClient('api', 'login', 'pass')
  const sent: SetRecordListSoapList[] = []
  // replace the SOAP transport with a recorder that reports every record as updated
  Object.assign(client, {
    soapClient: {
      setRecordList: (list: SetRecordListSoapList) => {
        sent.push(list)
        return Promise.resolve({
          setRecordListReturn: list.map(item => ({
            client_id: '',
            server_id: String(item.server_id),
            status: 'updated',
          })),
        })
      },
    },
  })
  return { client, sent }
}

test('updateOperations batches a move as both legs when the source leg id is given', async () => {
  const { client, sent } = stubbedClient()
  await client.updateOperations([
    {
      operationType: RecordType.Move,
      id: 11,
      linkedRecordId: 12,
      placeId: 100,
      fromPlaceId: 200,
      sum: 184000,
      currencyId: 65342,
      dateTime: '2026-08-03 23:59:00',
      comment: 'положила налик {ref:millennium-abc}',
    },
  ] as UpdateFinanceOperation[])

  expect(sent[0]).toMatchObject([
    { server_id: 11, server_move_id: 12, place_id: 100, budget_object_id: 200, sum: 184000, operation_type: 4 },
    { server_id: 12, server_move_id: 11, place_id: 200, budget_object_id: 100, sum: -184000, operation_type: 4 },
  ])
  expect(sent[0][1].comment).toBe('положила налик {ref:millennium-abc}')
})

test('updateOperations refuses a move without its source leg id', async () => {
  const { client } = stubbedClient()
  await expect(
    client.updateOperations([
      { operationType: RecordType.Move, id: 11, placeId: 100, fromPlaceId: 200, sum: 1, currencyId: 1 },
    ] as UpdateFinanceOperation[]),
  ).rejects.toThrow(/linkedRecordId/)
})
