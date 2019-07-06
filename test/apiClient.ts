import { ApiClient } from '../src'
import { FinanceOperation, isExchangeOperation } from '../src/FinanceOperation'
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

test.skip('GetRecordList API call', async () => {
  const result = await client.getRecordList({
    includeDepts: true,
    recordType: RecordType.Expense,
    periodType: PeriodType.LastMonth,
  })
  // console.debug(JSON.stringify(result, null, 2))
  expect(Array.isArray(result)).toBeTruthy()
})

test.skip('GetOperations API call', async () => {
  const result = await client.getOperations({
    includeDepts: true,
    recordType: RecordType.Exchange,
    periodType: PeriodType.LastYear,
  })
  // console.debug(JSON.stringify(result, null, 2))
  expect(Array.isArray(result)).toBeTruthy()
  for (const x of result) {
    expect(isExchangeOperation(x)).toBeTruthy()
    if (isExchangeOperation(x)) {
      expect(x.fromSum).toBeLessThan(0)
    }
  }
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

test.skip('CreateExpense API call', async () => {
  const result = await client.createExpense({
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

test.skip('Bulk operation creation', async () => {
  const operations: FinanceOperation[] = []
  operations.push({
    operationType: RecordType.Exchange,
    placeId: 40040,
    sum: 200,
    currencyId: 17,
    fromCurrencyId: 18,
    fromSum: 3333,
    comment: '222',
  })
  operations.push({
    operationType: RecordType.Expense,
    placeId: 40040,
    sum: 300,
    currencyId: 17,
    categoryId: 40010,
    comment: '222',
  })
  const result = await client.createOperations(operations)
  // console.debug(JSON.stringify(result, null, 2))
  expect(result).toHaveLength(2)
  expect(result[0]).toHaveLength(2)
})

test('GetPlaceList API call', async () => {
  const result = await client.getPlaceList()
  // console.debug(JSON.stringify(result, null, 2))
  expect(Array.isArray(result)).toBeTruthy()
  expect(result).not.toHaveLength(0)

  const filtered = await client.getPlaceList({ placeIds: result.slice(0, 2).map(x => x.id) })
  // console.debug(JSON.stringify(filtered, null, 2))
  expect(filtered).toHaveLength(2)
  expect(filtered[0].id).toEqual(result[0].id)
})
