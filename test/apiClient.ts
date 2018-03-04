import { ApiClient } from '../src'

let client: ApiClient

beforeAll(() => {
  client = new ApiClient('demo_api', 'demo@example.com', 'demo')
})

afterAll(() => {
  client = undefined as any
})

test('GetBalance API call', async () => {
  const result = await client.getBalance({
    atDate: '2016-11-29',
    withoutDepts: true,
    withoutAccumulations: true,
  })
  // console.debug(JSON.stringify(result, null, 2))
  expect(Array.isArray(result)).toBeTruthy()
})
