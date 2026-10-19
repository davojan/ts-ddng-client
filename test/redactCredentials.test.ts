import { redactCredentials } from '../src/SoapClient'

test('redactCredentials masks the auth arguments and keeps the rest of the request', () => {
  const request =
    '<ns1:getBalance xmlns:ns1="urn:ddengi"><apiId>my_api</apiId><login>me@example.com</login>' +
    '<pass xsi:type="xsd:string">secret</pass><params><item><key>restDate</key></item></params></ns1:getBalance>'
  const redacted = redactCredentials(request)
  expect(redacted).not.toMatch(/my_api|me@example\.com|secret/)
  expect(redacted).toContain('<apiId>***</apiId><login>***</login><pass xsi:type="xsd:string">***</pass>')
  expect(redacted).toContain('<key>restDate</key>')
})
