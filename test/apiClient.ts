import { ApiClient } from '../src'
import { PeriodType, RecordType } from '../src/messages/getRecordList'

let client: ApiClient

beforeAll(() => {
  client = new ApiClient('demo_api', 'demo@example.com', 'demo')
})

afterAll(() => {
  client = undefined as any
})

test.skip('GetBalance API call', async () => {
  const result = await client.getBalance({
    atDate: '2016-11-29',
    withoutDepts: true,
    withoutAccumulations: true,
  })
  // console.debug(JSON.stringify(result, null, 2))
  expect(Array.isArray(result)).toBeTruthy()
})

test('GetRecordList API call', async () => {
  const result = await client.getRecordList({
    includeDepts: true,
    recordType: RecordType.Move,
    periodType: PeriodType.LastMonth,
  })
  // console.debug(JSON.stringify(result, null, 2))
  expect(Array.isArray(result)).toBeTruthy()
})

test.skip('CreateIncome API call', async () => {
  const result = await client.createIncome({
    placeId: 40034,
    sourceId: 40036,
    sum: 20000,
    dateTime: '2010-12-14 13:58:00',
    comment: 'xxx',
    currencyId: 17,
  })
  expect(result).toBeGreaterThan(1)
})

test.skip('CreateExpence API call', async () => {
  const result = await client.createExpence({
    placeId: 40034,
    categoryId: 40010,
    sum: 20000,
    dateTime: '2010-12-14 13:58:00',
    comment: 'xxx',
    currencyId: 17,
  })
  expect(result).toBeGreaterThan(1)
})

test.skip('CreateMove API call', async () => {
  const result = await client.createMove({
    fromPlaceId: 41439,
    placeId: 40034,
    sum: 5000,
    dateTime: '2010-12-14 13:58:00',
    comment: 'xxx',
    currencyId: 17,
  })
  expect(result.length).toBeGreaterThanOrEqual(2)
})

test.skip('CreateExchange API call', async () => {
  const result = await client.createExchange({
    placeId: 40040,
    fromSum: 100,
    fromCurrencyId: 18,
    sum: 5500,
    currencyId: 17,
    dateTime: '2010-12-14 13:58:00',
    comment: 'xxx',
  })
  expect(result).toHaveLength(2)
})
