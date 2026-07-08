import { ApiClient } from '../src'

const integrationTest = process.env.DDNG_RUN_INTEGRATION === '1' ? test : test.skip
const testNamePrefix = `ts-ddng-client-test-place-${Date.now()}`

let client: ApiClient
let createdPlaceIds: number[] = []

beforeAll(() => {
  client = new ApiClient('demo_api', 'demo@example.com', 'demo')
})

afterEach(async () => {
  await cleanupCreatedPlaces()
})

afterAll(async () => {
  if (!client) {
    return
  }

  const places = await client.getPlaces()
  createdPlaceIds = places.filter(place => place.name.startsWith(testNamePrefix)).map(place => place.id)
  await cleanupCreatedPlaces()
})

integrationTest(
  'place CRUD works against the demo account',
  async () => {
    const name = `${testNamePrefix}-crud`
    const placeId = await client.createPlace({
      iconId: 0,
      isAutohide: true,
      isForDuty: true,
      isHidden: false,
      name,
      sort: 999_999,
    })
    createdPlaceIds.push(placeId)

    await expect(client.getPlaceById(placeId)).resolves.toMatchObject({
      iconId: 0,
      id: placeId,
      isAutohide: true,
      isForDuty: true,
      isHidden: false,
      name,
      parentId: null,
      sort: 999_999,
    })

    const updatedName = `${name}-updated`
    await client.updatePlace({
      iconId: 3,
      id: placeId,
      isAutohide: true,
      isHidden: true,
      name: updatedName,
      parentId: null,
      sort: 999_998,
    })

    await expect(client.getPlaceById(placeId)).resolves.toMatchObject({
      iconId: 3,
      id: placeId,
      isAutohide: true,
      isForDuty: true,
      isHidden: true,
      name: updatedName,
      parentId: null,
      sort: 999_998,
    })

    await client.deletePlace(placeId)
    createdPlaceIds = createdPlaceIds.filter(id => id !== placeId)

    await expect(client.getPlaceById(placeId)).resolves.toBeNull()
  },
  30_000,
)

integrationTest(
  'getPlaces returns existing demo places as a flat list',
  async () => {
    const places = await client.getPlaces()

    expect(places.length).toBeGreaterThan(0)
    expect(places[0]).toEqual(
      expect.objectContaining({
        budgetFamilyId: expect.any(Number),
        id: expect.any(Number),
        isAutohide: expect.any(Boolean),
        isCreditCard: expect.any(Boolean),
        isForDuty: expect.any(Boolean),
        isHidden: expect.any(Boolean),
        name: expect.any(String),
        sort: expect.any(Number),
      }),
    )
  },
  30_000,
)

async function cleanupCreatedPlaces(): Promise<void> {
  const ids = createdPlaceIds
  createdPlaceIds = []

  for (const id of ids) {
    try {
      await client.deletePlace(id)
    } catch {
      // Cleanup is best-effort; the CRUD assertion should report the real failure.
    }
  }
}
