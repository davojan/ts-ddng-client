import {
  ExpenseCategoryValidationError,
  createExpenseCategoryParamsToSoap,
  expenseCategoryListFromSoap,
  getExpenseCategoriesParamsToSoap,
  updateExpenseCategoryParamsToSoap,
} from '../src/messages/expenseCategories'

test('expenseCategoryListFromSoap maps SOAP category records to high-level categories', () => {
  expect(
    expenseCategoryListFromSoap({
      getCategoryListReturn: [
        {
          budget_family_id: '5',
          description: 'Groceries and cafes',
          id: '40001',
          is_hidden: 't',
          name: 'Food',
          parent_id: '-1',
          sort: '42',
          type: '3',
        },
      ],
    }),
  ).toEqual([
    {
      budgetFamilyId: 5,
      description: 'Groceries and cafes',
      id: 40001,
      isHidden: true,
      name: 'Food',
      parentId: null,
      sort: 42,
    },
  ])
})

test('getExpenseCategoriesParamsToSoap converts ids for idList filtering', () => {
  expect(getExpenseCategoriesParamsToSoap({ categoryIds: [1, 2] })).toEqual({
    idList: ['1', '2'],
  })
})

test('createExpenseCategoryParamsToSoap creates a Drebedengi waste category map', () => {
  expect(
    createExpenseCategoryParamsToSoap({
      description: 'A test category',
      isHidden: true,
      name: '  Test  ',
      parentId: 10,
      sort: 20,
    }),
  ).toMatchObject({
    description: 'A test category',
    is_for_duty: false,
    is_hidden: true,
    name: 'Test',
    parent_id: 10,
    sort: 20,
  })
})

test('updateExpenseCategoryParamsToSoap rejects self-parenting', () => {
  expect(() =>
    updateExpenseCategoryParamsToSoap({
      description: '',
      id: 10,
      isHidden: false,
      name: 'Test',
      parentId: 10,
      sort: 1,
    }),
  ).toThrow(ExpenseCategoryValidationError)
})

test('createExpenseCategoryParamsToSoap rejects empty names', () => {
  expect(() => createExpenseCategoryParamsToSoap({ name: '  ' })).toThrow(ExpenseCategoryValidationError)
})
