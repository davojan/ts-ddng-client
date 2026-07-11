import { ApiClient, PeriodType } from '../src'

const integrationTest = process.env.DDNG_RUN_INTEGRATION === '1' ? test : test.skip

let client: ApiClient

beforeAll(() => {
  client = new ApiClient('demo_api', 'demo@example.com', 'demo')
})

integrationTest(
  'getIncomeReport returns income totals grouped by source',
  async () => {
    const report = await client.getIncomeReport({
      displayCurrencyId: 17,
      periodType: PeriodType.AllTime,
    })

    expect(report.length).toBeGreaterThan(0)
    expect(report[0]).toEqual({
      amount: expect.any(Number),
      currencyId: 17,
      hasChildren: expect.any(Boolean),
      parentSourceId: expect.toSatisfy((value: unknown) => value === null || typeof value === 'number'),
      sourceId: expect.any(Number),
      sourceName: expect.any(String),
    })
    expect(report.every(item => item.amount >= 0)).toBe(true)
  },
  30_000,
)

integrationTest(
  'getExpenseReport returns positive expense totals grouped by category',
  async () => {
    const report = await client.getExpenseReport({
      displayCurrencyId: 17,
      periodType: PeriodType.AllTime,
    })

    expect(report.length).toBeGreaterThan(0)
    expect(report[0]).toEqual({
      amount: expect.any(Number),
      categoryId: expect.any(Number),
      categoryName: expect.any(String),
      currencyId: 17,
      hasChildren: expect.any(Boolean),
      parentCategoryId: expect.toSatisfy((value: unknown) => value === null || typeof value === 'number'),
    })
    expect(report.every(item => item.amount >= 0)).toBe(true)
  },
  30_000,
)
