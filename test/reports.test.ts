import {
  expenseReportFromSoap,
  getExpenseReportParamsToSoap,
  getIncomeReportParamsToSoap,
  incomeReportFromSoap,
} from '../src/messages/getReport'
import { AveragingType, GrouppingType, RecordType } from '../src/messages/getRecordList'

test('income report params force source grouping and income records', () => {
  expect(getIncomeReportParamsToSoap({ averaging: AveragingType.Monthly })).toMatchObject({
    r_how: GrouppingType.IncomeBySource,
    r_middle: AveragingType.Monthly,
    r_what: RecordType.Income,
  })
})

test('expense report params force category grouping and expense records', () => {
  expect(getExpenseReportParamsToSoap({})).toMatchObject({
    r_how: GrouppingType.ExpenseByCategory,
    r_middle: AveragingType.NoAveraging,
    r_what: RecordType.Expense,
  })
})

test('income report maps source hierarchy and leaf state', () => {
  expect(
    incomeReportFromSoap({
      getRecordListReturn: {
        '40036': {
          budget_object_id: '40036',
          currency_id: '17',
          difference: '123.45',
          name: 'Salary',
          nochild: 't',
          parent_id: '-1',
        },
      },
    }),
  ).toEqual([
    {
      amount: 123.45,
      currencyId: 17,
      hasChildren: false,
      parentSourceId: null,
      sourceId: 40036,
      sourceName: 'Salary',
    },
  ])
})

test('expense report normalizes negative totals and maps category hierarchy', () => {
  expect(
    expenseReportFromSoap({
      getRecordListReturn: [
        {
          budget_object_id: '40010',
          currency_id: '17',
          difference: '-321.5',
          name: 'Lunch',
          nochild: 'f',
          parent_id: '40001',
        },
      ],
    }),
  ).toEqual([
    {
      amount: 321.5,
      categoryId: 40010,
      categoryName: 'Lunch',
      currencyId: 17,
      hasChildren: true,
      parentCategoryId: 40001,
    },
  ])
})
