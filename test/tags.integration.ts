import { ApiClient } from '../src'

const integrationTest = process.env.DDNG_RUN_INTEGRATION === '1' ? test : test.skip
const testNamePrefix = `ts-ddng-client-test-tag-${Date.now()}`

let client: ApiClient
let createdTagIds: number[] = []

beforeAll(() => {
  client = new ApiClient('demo_api', 'demo@example.com', 'demo')
})

afterEach(async () => {
  await cleanupCreatedTags()
})

afterAll(async () => {
  if (!client) {
    return
  }

  const tags = await client.getTags()
  createdTagIds = tags.filter(tag => tag.name.startsWith(testNamePrefix)).map(tag => tag.id)
  await cleanupCreatedTags()
})

integrationTest(
  'tag CRUD works against the demo account',
  async () => {
    const name = `${testNamePrefix}-crud`
    const tagId = await client.createTag({
      isFamily: false,
      isHidden: false,
      name,
      sort: 999_999,
    })
    createdTagIds.push(tagId)

    await expect(client.getTagById(tagId)).resolves.toMatchObject({
      id: tagId,
      isFamily: false,
      isHidden: false,
      name,
      parentId: null,
      sort: 999_999,
    })

    const updatedName = `${name}-updated`
    await client.updateTag({
      id: tagId,
      isFamily: true,
      isHidden: true,
      name: updatedName,
      parentId: null,
      sort: 999_998,
    })

    await expect(client.getTagById(tagId)).resolves.toMatchObject({
      id: tagId,
      isFamily: true,
      isHidden: true,
      name: updatedName,
      parentId: null,
      sort: 999_998,
    })

    await client.deleteTag(tagId)
    createdTagIds = createdTagIds.filter(id => id !== tagId)

    await expect(client.getTagById(tagId)).resolves.toBeNull()
  },
  30_000,
)

integrationTest(
  'getTags returns existing demo tags as a flat list',
  async () => {
    const tags = await client.getTags()

    expect(tags.length).toBeGreaterThan(0)
    expect(tags[0]).toEqual(
      expect.objectContaining({
        familyId: expect.any(Number),
        id: expect.any(Number),
        isFamily: expect.any(Boolean),
        isHidden: expect.any(Boolean),
        name: expect.any(String),
        sort: expect.any(Number),
        userId: expect.any(Number),
      }),
    )
  },
  30_000,
)

async function cleanupCreatedTags(): Promise<void> {
  const ids = createdTagIds
  createdTagIds = []

  for (const id of ids) {
    try {
      await client.deleteTag(id)
    } catch {
      // Cleanup is best-effort; the CRUD assertion should report the real failure.
    }
  }
}
