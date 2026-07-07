import { ApiClient } from '../src'

const integrationTest = process.env.DDNG_RUN_INTEGRATION === '1' ? test : test.skip
const testNamePrefix = `ts-ddng-client-test-income-source-${Date.now()}`

let client: ApiClient
let createdSourceIds: number[] = []

beforeAll(() => {
  client = new ApiClient('demo_api', 'demo@example.com', 'demo')
})

afterEach(async () => {
  await cleanupCreatedSources()
})

afterAll(async () => {
  if (!client) {
    return
  }

  const sources = await client.getIncomeSources()
  createdSourceIds = sources.filter(source => source.name.startsWith(testNamePrefix)).map(source => source.id)
  await cleanupCreatedSources()
})

integrationTest(
  'income source CRUD works against the demo account',
  async () => {
    const name = `${testNamePrefix}-crud`
    const sourceId = await client.createIncomeSource({
      description: 'created by integration test',
      isHidden: false,
      name,
      sort: 999_999,
    })
    createdSourceIds.push(sourceId)

    await expect(client.getIncomeSourceById(sourceId)).resolves.toMatchObject({
      description: 'created by integration test',
      id: sourceId,
      isHidden: false,
      name,
      parentId: null,
      sort: 999_999,
    })

    const updatedName = `${name}-updated`
    await client.updateIncomeSource({
      description: 'updated by integration test',
      id: sourceId,
      isHidden: true,
      name: updatedName,
      parentId: null,
      sort: 999_998,
    })

    await expect(client.getIncomeSourceById(sourceId)).resolves.toMatchObject({
      description: 'updated by integration test',
      id: sourceId,
      isHidden: true,
      name: updatedName,
      parentId: null,
      sort: 999_998,
    })

    await client.deleteIncomeSource(sourceId)
    createdSourceIds = createdSourceIds.filter(id => id !== sourceId)

    await expect(client.getIncomeSourceById(sourceId)).resolves.toBeNull()
  },
  30_000,
)

integrationTest(
  'getIncomeSources returns existing demo income sources as a flat list',
  async () => {
    const sources = await client.getIncomeSources()

    expect(sources.length).toBeGreaterThan(0)
    expect(sources[0]).toEqual(
      expect.objectContaining({
        budgetFamilyId: expect.any(Number),
        description: expect.any(String),
        id: expect.any(Number),
        isHidden: expect.any(Boolean),
        name: expect.any(String),
        sort: expect.any(Number),
      }),
    )
  },
  30_000,
)

async function cleanupCreatedSources(): Promise<void> {
  const ids = createdSourceIds
  createdSourceIds = []

  for (const id of ids) {
    try {
      await client.deleteIncomeSource(id)
    } catch {
      // Cleanup is best-effort; the CRUD assertion should report the real failure.
    }
  }
}
