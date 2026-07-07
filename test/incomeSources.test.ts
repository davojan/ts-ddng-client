import {
  IncomeSourceValidationError,
  createIncomeSourceParamsToSoap,
  getIncomeSourcesParamsToSoap,
  incomeSourceListFromSoap,
  updateIncomeSourceParamsToSoap,
} from '../src/messages/incomeSources'

test('incomeSourceListFromSoap maps SOAP source records to high-level income sources', () => {
  expect(
    incomeSourceListFromSoap({
      getSourceListReturn: [
        {
          budget_family_id: '5',
          description: 'Salary and bonuses',
          id: '40035',
          is_hidden: 't',
          name: 'Job',
          parent_id: '-1',
          sort: '42',
          type: '2',
        },
      ],
    }),
  ).toEqual([
    {
      budgetFamilyId: 5,
      description: 'Salary and bonuses',
      id: 40035,
      isHidden: true,
      name: 'Job',
      parentId: null,
      sort: 42,
    },
  ])
})

test('getIncomeSourcesParamsToSoap converts ids for idList filtering', () => {
  expect(getIncomeSourcesParamsToSoap({ sourceIds: [1, 2] })).toEqual({
    idList: ['1', '2'],
  })
})

test('createIncomeSourceParamsToSoap creates a Drebedengi income source map', () => {
  expect(
    createIncomeSourceParamsToSoap({
      description: 'A test source',
      isHidden: true,
      name: '  Test  ',
      parentId: 10,
      sort: 20,
    }),
  ).toMatchObject({
    description: 'A test source',
    is_for_duty: false,
    is_hidden: true,
    name: 'Test',
    parent_id: 10,
    sort: 20,
  })
})

test('updateIncomeSourceParamsToSoap rejects self-parenting', () => {
  expect(() =>
    updateIncomeSourceParamsToSoap({
      description: '',
      id: 10,
      isHidden: false,
      name: 'Test',
      parentId: 10,
      sort: 1,
    }),
  ).toThrow(IncomeSourceValidationError)
})

test('createIncomeSourceParamsToSoap rejects empty names', () => {
  expect(() => createIncomeSourceParamsToSoap({ name: '  ' })).toThrow(IncomeSourceValidationError)
})
