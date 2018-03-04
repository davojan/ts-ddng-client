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

test('GetRecordList SOAP call', async () => {
  const result = await client.getRecordList({
    is_report: true,
    is_show_duty: true,
    r_how: GrouppingType.NoGroupping,
    r_what: RecordType.Income,
    r_period: PeriodType.Today,
  })
  // console.debug(JSON.stringify(result, null, 2))
  expect(result).toBeDefined()
})
