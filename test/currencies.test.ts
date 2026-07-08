import {
  CurrencyValidationError,
  createCurrencyParamsToSoap,
  currencyListFromSoap,
  getCurrenciesParamsToSoap,
  updateCurrencyParamsToSoap,
} from '../src/messages/currencies'

test('currencyListFromSoap maps SOAP currency records to high-level currencies', () => {
  expect(
    currencyListFromSoap({
      getCurrencyListReturn: [
        {
          code: 'USD',
          course: '76.12',
          family_id: '5',
          id: '17',
          is_autoupdate: 't',
          is_default: 'f',
          is_hidden: 't',
          name: 'US Dollar',
        },
      ],
    }),
  ).toEqual([
    {
      code: 'USD',
      course: '76.12',
      familyId: 5,
      id: 17,
      isAutoupdate: true,
      isDefault: false,
      isHidden: true,
      name: 'US Dollar',
    },
  ])
})

test('getCurrenciesParamsToSoap converts ids for idList filtering', () => {
  expect(getCurrenciesParamsToSoap({ currencyIds: [1, 2] })).toEqual({
    idList: ['1', '2'],
  })
})

test('createCurrencyParamsToSoap creates a Drebedengi currency map', () => {
  expect(
    createCurrencyParamsToSoap({
      code: 'USD',
      course: '76.12',
      isAutoupdate: true,
      isDefault: true,
      isHidden: true,
      name: '  Dollar  ',
    }),
  ).toMatchObject({
    code: 'USD',
    course: '76.12',
    is_autoupdate: true,
    is_default: true,
    is_hidden: true,
    name: 'Dollar',
  })
})

test('updateCurrencyParamsToSoap rejects empty names', () => {
  expect(() =>
    updateCurrencyParamsToSoap({
      code: 'USD',
      course: '76.12',
      id: 10,
      isAutoupdate: false,
      isDefault: false,
      isHidden: false,
      name: '  ',
    }),
  ).toThrow(CurrencyValidationError)
})

test('createCurrencyParamsToSoap requires code when autoupdate is enabled', () => {
  expect(() =>
    createCurrencyParamsToSoap({
      course: '76.12',
      isAutoupdate: true,
      name: 'USD',
    }),
  ).toThrow(CurrencyValidationError)
})
