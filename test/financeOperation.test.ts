import { recordListToOperations } from '../src/FinanceOperation'
import { RecordType } from '../src/messages/getRecordList'

test('recordListToOperations collapses exchange records into one operation', () => {
  const result = recordListToOperations([
    {
      budgetFamilyId: 1,
      budgetObjectId: 7,
      categoryName: 'USD',
      comment: 'exchange',
      currencyId: 17,
      dateTime: '2024-01-01 10:00:00',
      groupId: null,
      id: 10,
      isDept: false,
      linkedRecordId: 11,
      operationType: RecordType.Exchange,
      placeId: 5,
      sum: 5500,
      timestamp: 1,
      userId: 3,
    },
    {
      budgetFamilyId: 1,
      budgetObjectId: 7,
      categoryName: 'EUR',
      comment: '',
      currencyId: 18,
      dateTime: '2024-01-01 10:00:00',
      groupId: null,
      id: 11,
      isDept: false,
      linkedRecordId: 10,
      operationType: RecordType.Exchange,
      placeId: 5,
      sum: -100,
      timestamp: 2,
      userId: 3,
    },
  ])

  expect(result).toEqual([
    {
      comment: 'exchange',
      currencyId: 17,
      dateTime: '2024-01-01 10:00:00',
      fromCurrencyId: 18,
      fromSum: 100,
      id: 10,
      operationType: RecordType.Exchange,
      placeId: 5,
      sum: 5500,
    },
  ])
})

test('recordListToOperations normalizes expense amount to positive user amount', () => {
  expect(
    recordListToOperations([
      {
        budgetFamilyId: 1,
        budgetObjectId: 7,
        categoryName: 'Food',
        comment: 'expense',
        currencyId: 17,
        dateTime: '2024-01-01 10:00:00',
        groupId: null,
        id: 12,
        isDept: false,
        operationType: RecordType.Expense,
        placeId: 5,
        sum: -123,
        timestamp: 1,
        userId: 3,
      },
    ]),
  ).toEqual([
    {
      categoryId: 7,
      comment: 'expense',
      currencyId: 17,
      dateTime: '2024-01-01 10:00:00',
      id: 12,
      operationType: RecordType.Expense,
      placeId: 5,
      sum: 123,
    },
  ])
})
