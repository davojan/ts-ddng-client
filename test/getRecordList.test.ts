import {
  FilterType,
  PeriodType,
  RecordType,
  getRecordListParamsToSoap,
  recordListFromSoap,
} from '../src/messages/getRecordList'

test('getRecordListParamsToSoap uses custom period boundaries', () => {
  expect(
    getRecordListParamsToSoap({
      categoryIds: [1],
      periodFrom: '2024-01-01',
      periodTo: '2024-01-31',
      periodType: PeriodType.Custom,
      placeIds: [10],
    }),
  ).toMatchObject({
    is_report: true,
    period_from: '2024-01-01',
    period_to: '2024-01-31',
    r_is_category: FilterType.OnlySelected,
    r_is_place: FilterType.OnlySelected,
    r_period: PeriodType.Custom,
    r_place: ['10'],
  })
})

test('recordListFromSoap maps idList object responses', () => {
  expect(
    recordListFromSoap({
      getRecordListReturn: {
        '10': {
          budget_family_id: '5',
          budget_object_id: '20',
          comment: 'move',
          currency_id: '17',
          group_id: null,
          id: '10',
          is_duty: 'f',
          operation_date: '2026-07-08 12:00:00',
          operation_type: '4',
          place_id: '30',
          server_move_id: '11',
          sum: '100',
          user_nuid: '40',
        },
      },
    }),
  ).toEqual([
    {
      budgetFamilyId: 5,
      budgetObjectId: 20,
      categoryName: '',
      comment: 'move',
      currencyId: 17,
      dateTime: '2026-07-08 12:00:00',
      groupId: null,
      id: 10,
      isDept: false,
      linkedRecordId: 11,
      operationType: RecordType.Move,
      placeId: 30,
      sum: 100,
      timestamp: 0,
      userId: 40,
    },
  ])
})
