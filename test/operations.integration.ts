import { ApiClient, PeriodType } from '../src'

const integrationTest = process.env.DDNG_RUN_INTEGRATION === '1' ? test : test.skip

const PLACE_ID = 40034
const MOVE_FROM_PLACE_ID = 41439
const EXCHANGE_PLACE_ID = 40040
const CATEGORY_ID = 40010
const SOURCE_ID = 40036
const CURRENCY_ID = 17
const FROM_CURRENCY_ID = 18
const OPERATION_DATE = '2026-07-08 12:00:00'

let client: ApiClient

beforeAll(() => {
  client = new ApiClient('demo_api', 'demo@example.com', 'demo')
})

integrationTest(
  'expense CRUD works against the demo account',
  async () => {
    const commentPrefix = testCommentPrefix()
    let expenseId: number | null = null

    try {
      expenseId = await client.createExpense({
        categoryId: CATEGORY_ID,
        comment: `${commentPrefix}-expense`,
        currencyId: CURRENCY_ID,
        dateTime: OPERATION_DATE,
        placeId: PLACE_ID,
        sum: 101,
      })

      await waitForOperation(() => client.getExpenseById(expenseId!))
      await client.updateExpense({
        categoryId: CATEGORY_ID,
        comment: `${commentPrefix}-expense-updated`,
        currencyId: CURRENCY_ID,
        dateTime: OPERATION_DATE,
        id: expenseId,
        placeId: PLACE_ID,
        sum: 102,
      })

      expect(await waitForOperation(() => client.getExpenseById(expenseId!))).toMatchObject({
        categoryId: CATEGORY_ID,
        comment: `${commentPrefix}-expense-updated`,
        currencyId: CURRENCY_ID,
        id: expenseId,
        placeId: PLACE_ID,
        sum: 102,
      })

      await client.deleteExpense(expenseId)
      expect(await findExpenseById(expenseId)).toBeNull()
      expenseId = null
    } finally {
      await deleteOperationIfNeeded(expenseId, id => client.deleteExpense(id))
    }
  },
  60_000,
)

integrationTest(
  'income CRUD works against the demo account',
  async () => {
    const commentPrefix = testCommentPrefix()
    let incomeId: number | null = null

    try {
      incomeId = await client.createIncome({
        comment: `${commentPrefix}-income`,
        currencyId: CURRENCY_ID,
        dateTime: OPERATION_DATE,
        placeId: PLACE_ID,
        sourceId: SOURCE_ID,
        sum: 201,
      })

      await waitForOperation(() => client.getIncomeById(incomeId!))
      await client.updateIncome({
        comment: `${commentPrefix}-income-updated`,
        currencyId: CURRENCY_ID,
        dateTime: OPERATION_DATE,
        id: incomeId,
        placeId: PLACE_ID,
        sourceId: SOURCE_ID,
        sum: 202,
      })

      expect(await waitForOperation(() => client.getIncomeById(incomeId!))).toMatchObject({
        comment: `${commentPrefix}-income-updated`,
        currencyId: CURRENCY_ID,
        id: incomeId,
        placeId: PLACE_ID,
        sourceId: SOURCE_ID,
        sum: 202,
      })

      await client.deleteIncome(incomeId)
      expect(await findIncomeById(incomeId)).toBeNull()
      incomeId = null
    } finally {
      await deleteOperationIfNeeded(incomeId, id => client.deleteIncome(id))
    }
  },
  60_000,
)

integrationTest(
  'move CRUD works against the demo account',
  async () => {
    const commentPrefix = testCommentPrefix()
    let moveId: number | null = null

    try {
      moveId = await client.createMove({
        comment: `${commentPrefix}-move`,
        currencyId: CURRENCY_ID,
        dateTime: OPERATION_DATE,
        fromPlaceId: MOVE_FROM_PLACE_ID,
        placeId: PLACE_ID,
        sum: 301,
      })

      await waitForOperation(() => client.getMoveById(moveId!))
      await client.updateMove({
        comment: `${commentPrefix}-move-updated`,
        currencyId: CURRENCY_ID,
        dateTime: OPERATION_DATE,
        fromPlaceId: MOVE_FROM_PLACE_ID,
        id: moveId,
        placeId: PLACE_ID,
        sum: 302,
      })

      expect(await waitForOperation(() => client.getMoveById(moveId!))).toMatchObject({
        comment: `${commentPrefix}-move-updated`,
        currencyId: CURRENCY_ID,
        fromPlaceId: MOVE_FROM_PLACE_ID,
        id: moveId,
        placeId: PLACE_ID,
        sum: 302,
      })

      await client.deleteMove(moveId)
      expect(await findMoveById(moveId)).toBeNull()
      moveId = null
    } finally {
      await deleteOperationIfNeeded(moveId, id => client.deleteMove(id))
    }
  },
  60_000,
)

integrationTest(
  'exchange CRUD works against the demo account',
  async () => {
    const commentPrefix = testCommentPrefix()
    let exchangeId: number | null = null

    try {
      exchangeId = await client.createExchange({
        comment: `${commentPrefix}-exchange`,
        currencyId: CURRENCY_ID,
        dateTime: OPERATION_DATE,
        fromCurrencyId: FROM_CURRENCY_ID,
        fromSum: 402,
        placeId: EXCHANGE_PLACE_ID,
        sum: 401,
      })

      await waitForOperation(() => client.getExchangeById(exchangeId!))
      await client.updateExchange({
        comment: `${commentPrefix}-exchange-updated`,
        currencyId: CURRENCY_ID,
        dateTime: OPERATION_DATE,
        fromCurrencyId: FROM_CURRENCY_ID,
        fromSum: 404,
        id: exchangeId,
        placeId: EXCHANGE_PLACE_ID,
        sum: 403,
      })

      expect(await waitForOperation(() => client.getExchangeById(exchangeId!))).toMatchObject({
        comment: `${commentPrefix}-exchange-updated`,
        currencyId: CURRENCY_ID,
        fromCurrencyId: FROM_CURRENCY_ID,
        fromSum: 404,
        id: exchangeId,
        placeId: EXCHANGE_PLACE_ID,
        sum: 403,
      })

      await client.deleteExchange(exchangeId)
      expect(await findExchangeById(exchangeId)).toBeNull()
      exchangeId = null
    } finally {
      await deleteOperationIfNeeded(exchangeId, id => client.deleteExchange(id))
    }
  },
  60_000,
)

async function waitForOperation<TOperation>(fetchOperation: () => Promise<TOperation | null>): Promise<TOperation> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const operation = await fetchOperation()

    if (operation) {
      return operation
    }

    await new Promise(resolve => setTimeout(resolve, 250))
  }

  throw new Error('Operation was not visible after create/update')
}

async function deleteOperationIfNeeded(
  id: number | null,
  deleteOperation: (id: number) => Promise<void>,
): Promise<void> {
  if (id == null) {
    return
  }

  try {
    await deleteOperation(id)
  } catch {
    // Best-effort cleanup for demo-account integration data.
  }
}

async function findExpenseById(id: number) {
  return (await client.getExpenses(operationTestPeriod())).find(operation => operation.id === id) || null
}

async function findIncomeById(id: number) {
  return (await client.getIncomes(operationTestPeriod())).find(operation => operation.id === id) || null
}

async function findMoveById(id: number) {
  return (await client.getMoves(operationTestPeriod())).find(operation => operation.id === id) || null
}

async function findExchangeById(id: number) {
  return (await client.getExchanges(operationTestPeriod())).find(operation => operation.id === id) || null
}

function operationTestPeriod() {
  return {
    periodFrom: '2026-07-08',
    periodTo: '2026-07-08',
    periodType: PeriodType.Custom,
  }
}

function testCommentPrefix(): string {
  return `top-${Date.now().toString().slice(-6)}`
}
