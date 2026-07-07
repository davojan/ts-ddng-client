import { ApiClient } from '../src'

const integrationTest = process.env.DDNG_RUN_INTEGRATION === '1' ? test : test.skip
const testNamePrefix = `ts-ddng-client-test-${Date.now()}`

let client: ApiClient
let createdCategoryIds: number[] = []

beforeAll(() => {
  client = new ApiClient('demo_api', 'demo@example.com', 'demo')
})

afterEach(async () => {
  await cleanupCreatedCategories()
})

afterAll(async () => {
  if (!client) {
    return
  }

  const categories = await client.getExpenseCategories()
  createdCategoryIds = categories
    .filter(category => category.name.startsWith(testNamePrefix))
    .map(category => category.id)
  await cleanupCreatedCategories()
})

integrationTest(
  'expense category CRUD works against the demo account',
  async () => {
    const name = `${testNamePrefix}-crud`
    const categoryId = await client.createExpenseCategory({
      description: 'created by integration test',
      isHidden: false,
      name,
      sort: 999_999,
    })
    createdCategoryIds.push(categoryId)

    await expect(client.getExpenseCategoryById(categoryId)).resolves.toMatchObject({
      description: 'created by integration test',
      id: categoryId,
      isHidden: false,
      name,
      parentId: null,
      sort: 999_999,
    })

    const updatedName = `${name}-updated`
    await client.updateExpenseCategory({
      description: 'updated by integration test',
      id: categoryId,
      isHidden: true,
      name: updatedName,
      parentId: null,
      sort: 999_998,
    })

    await expect(client.getExpenseCategoryById(categoryId)).resolves.toMatchObject({
      description: 'updated by integration test',
      id: categoryId,
      isHidden: true,
      name: updatedName,
      parentId: null,
      sort: 999_998,
    })

    await client.deleteExpenseCategory(categoryId)
    createdCategoryIds = createdCategoryIds.filter(id => id !== categoryId)

    await expect(client.getExpenseCategoryById(categoryId)).resolves.toBeNull()
  },
  30_000,
)

integrationTest(
  'getExpenseCategories returns existing demo categories as a flat list',
  async () => {
    const categories = await client.getExpenseCategories()

    expect(categories.length).toBeGreaterThan(0)
    expect(categories[0]).toEqual(
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

async function cleanupCreatedCategories(): Promise<void> {
  const ids = createdCategoryIds
  createdCategoryIds = []

  for (const id of ids) {
    try {
      await client.deleteExpenseCategory(id)
    } catch {
      // Cleanup is best-effort; the CRUD assertion should report the real failure.
    }
  }
}
