import { SoapClient } from '../src'
import { GrouppingType, RecordType, PeriodType } from '../src/messages/getRecordList'

let client: SoapClient

beforeAll(() => {
  client = new SoapClient('demo_api', 'demo@example.com', 'demo')
})

afterAll(() => {
  client = undefined as any
})

test.skip('GetBalance SOAP call', async () => {
  const result = await client.getBalance({ restDate: '2010-11-29', is_with_accum: true })
  // console.debug(JSON.stringify(result, null, 2))
  expect(result).toBeDefined()
  expect(Array.isArray(result.getBalanceReturn)).toBeTruthy()
})

test.skip('GetRecordList SOAP call', async () => {
  const result = await client.getRecordList({
    is_report: true,
    is_show_duty: true,
    r_how: GrouppingType.NoGroupping,
    r_what: RecordType.Exchange,
    r_period: PeriodType.LastYear,
  })
  // console.debug(JSON.stringify(result, null, 2))
  expect(result).toBeDefined()
})

test.skip('SetRecordList SOAP call', async () => {
  const result = await client.setRecordList([
    {
      client_id: 11111,
      place_id: 40034,
      budget_object_id: 40012,
      sum: 20000,
      operation_date: '2010-12-14 13:58:00',
      comment: 'xxx',
      currency_id: 17,
      is_duty: false,
      operation_type: 3,
    },
    {
      client_id: 222,
      place_id: 40034,
      budget_object_id: 40012,
      sum: 20000,
      operation_date: '2010-12-14 13:58:00',
      comment: 'xxx 1',
      currency_id: 17,
      is_duty: false,
      operation_type: 3,
    },
  ])
  // console.debug(JSON.stringify(result, null, 2))
  expect(result).toBeDefined()
})
