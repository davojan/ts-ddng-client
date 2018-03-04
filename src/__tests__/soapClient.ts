import { SoapClient } from '..'

let client: SoapClient

beforeAll(() => {
  client = new SoapClient('demo_api', 'demo@example.com', 'demo')
})

afterAll(() => {
  client = undefined as any
})

test('GetBalance SOAP call', async () => {
  const result = await client.getBalance({ restDate: '2010-11-29', is_with_accum: true })
  // console.debug(JSON.stringify(result, null, 2))
  expect(result).toBeDefined()
  expect(Array.isArray(result.getBalanceReturn)).toBeTruthy()
})
