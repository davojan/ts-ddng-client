import {SoapClient} from '..'

let client: SoapClient

beforeAll(() => {
  client = new SoapClient('demo_api', 'demo@example.com', 'demo')
})

afterAll(() => {
  client = undefined as any
})

test('GetBalance SOAP call', async () => {
  const result = await client.getBalance()
  // console.info(JSON.stringify(result.getBalanceReturn.item, null, 2))
  expect(result).toBeDefined()
})
