import { ApiClient } from '../src'

const integrationTest = process.env.DDNG_RUN_INTEGRATION === '1' ? test : test.skip
const testNamePrefix = `tcur-${Date.now().toString().slice(-6)}`

let client: ApiClient
let createdCurrencyIds: number[] = []

beforeAll(() => {
  client = new ApiClient('demo_api', 'demo@example.com', 'demo')
})

afterEach(async () => {
  await cleanupCreatedCurrencies()
})

afterAll(async () => {
  if (!client) {
    return
  }

  const currencies = await client.getCurrencies()
  createdCurrencyIds = currencies
    .filter(currency => currency.name.startsWith(testNamePrefix))
    .map(currency => currency.id)
  await cleanupCreatedCurrencies()
})

integrationTest(
  'currency CRUD works against the demo account',
  async () => {
    const name = `${testNamePrefix}-c`
    const createCourse = '123.45'
    const currencyId = await client.createCurrency({
      course: createCourse,
      isAutoupdate: false,
      isDefault: false,
      isHidden: false,
      name,
    })
    createdCurrencyIds.push(currencyId)

    const createdCurrency = await waitForCurrencyById(currencyId)
    expect(createdCurrency).toMatchObject({
      id: currencyId,
      isAutoupdate: false,
      isDefault: false,
      isHidden: false,
      name,
    })
    expect(createdCurrency).not.toBeNull()
    if (!createdCurrency) {
      throw new Error(`Currency ${currencyId} was not returned after creation`)
    }
    expect(+createdCurrency.course).toBeCloseTo(+createCourse, 2)

    const updatedName = `${testNamePrefix}-u`
    const updateCourse = '234.56'
    await client.updateCurrency({
      code: '',
      course: updateCourse,
      id: currencyId,
      isAutoupdate: false,
      isDefault: false,
      isHidden: true,
      name: updatedName,
    })

    const updatedCurrency = await waitForCurrencyById(currencyId)
    expect(updatedCurrency).toMatchObject({
      id: currencyId,
      isAutoupdate: false,
      isDefault: false,
      isHidden: true,
      name: updatedName,
    })
    expect(updatedCurrency).not.toBeNull()
    if (!updatedCurrency) {
      throw new Error(`Currency ${currencyId} was not returned after update`)
    }
    expect(+updatedCurrency.course).toBeCloseTo(+updateCourse, 2)

    await client.deleteCurrency(currencyId)
    createdCurrencyIds = createdCurrencyIds.filter(id => id !== currencyId)

    await expect(client.getCurrencyById(currencyId)).resolves.toBeNull()
  },
  30_000,
)

integrationTest(
  'getCurrencies returns existing demo currencies as a flat list',
  async () => {
    const currencies = await client.getCurrencies()

    expect(currencies.length).toBeGreaterThan(0)
    expect(currencies[0]).toEqual(
      expect.objectContaining({
        code: expect.any(String),
        course: expect.any(String),
        familyId: expect.any(Number),
        id: expect.any(Number),
        isAutoupdate: expect.any(Boolean),
        isDefault: expect.any(Boolean),
        isHidden: expect.any(Boolean),
        name: expect.any(String),
      }),
    )
  },
  30_000,
)

async function cleanupCreatedCurrencies(): Promise<void> {
  const ids = createdCurrencyIds
  createdCurrencyIds = []

  for (const id of ids) {
    try {
      await client.deleteCurrency(id)
    } catch {
      // Cleanup is best-effort; the CRUD assertion should report the real failure.
    }
  }
}

async function waitForCurrencyById(id: number): Promise<Awaited<ReturnType<ApiClient['getCurrencyById']>>> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const currency = await client.getCurrencyById(id)
    if (currency) {
      return currency
    }

    await new Promise(resolve => setTimeout(resolve, 250))
  }

  return null
}
