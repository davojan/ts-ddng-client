import { FilterType, PeriodType, getRecordListParamsToSoap } from '../src/messages/getRecordList'

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
