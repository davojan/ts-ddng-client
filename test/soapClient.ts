import { FilterType, SoapClient } from '../src'
import { GrouppingType, PeriodType, RecordType } from '../src/messages/getRecordList'

let client: SoapClient
const integrationTest = process.env.DDNG_RUN_LEGACY_INTEGRATION === '1' ? test : test.skip

beforeAll(() => {
  client = new SoapClient('demo_api', 'demo@example.com', 'demo')
})

integrationTest(
  'GetBalance SOAP call',
  async () => {
    const result = await client.getBalance({ restDate: '2010-11-29', is_with_accum: true })
    // console.debug(JSON.stringify(result, null, 2))
    expect(result).toBeDefined()
    expect(Array.isArray(result.getBalanceReturn)).toBeTruthy()
  },
  30_000,
)

integrationTest(
  'GetRecordList SOAP call',
  async () => {
    const places = await client.getPlaceList()
    const result = await client.getRecordList({
      is_report: true,
      is_show_duty: true,
      r_how: GrouppingType.NoGroupping,
      r_what: RecordType.Exchange,
      r_period: PeriodType.LastYear,
      r_is_place: FilterType.OnlySelected,
      r_place: [places.getPlaceListReturn[0].id],
    })
    // console.debug(JSON.stringify(result, null, 2))
    expect(result).toBeDefined()
    expect(result.getRecordListReturn).not.toHaveLength(0)
  },
  30_000,
)

integrationTest(
  'SetRecordList SOAP call',
  async () => {
    const result = await client.setRecordList([
      {
        client_id: 11111,
        place_id: 40034,
        budget_object_id: 40012,
        sum: 20000,
        operation_date: '2010-12-14 13:58:00',
        comment: 'xxx',
        currency_id: 17,
        is_duty: false,
        operation_type: 3,
      },
      {
        client_id: 222,
        place_id: 40034,
        budget_object_id: 40012,
        sum: 20000,
        operation_date: '2010-12-14 13:58:00',
        comment: 'xxx 1',
        currency_id: 17,
        is_duty: false,
        operation_type: 3,
      },
    ])
    // console.debug(JSON.stringify(result, null, 2))
    expect(result).toBeDefined()
  },
  30_000,
)

integrationTest(
  'GetPlaceList SOAP call',
  async () => {
    const result = await client.getPlaceList()
    // console.debug(JSON.stringify(result, null, 2))
    expect(result).toBeDefined()
    expect(result.getPlaceListReturn).not.toHaveLength(0)

    const filtered = await client.getPlaceList({
      idList: [result.getPlaceListReturn[0].id, result.getPlaceListReturn[1].id],
    })
    // console.debug(JSON.stringify(filtered, null, 2))
    expect(filtered.getPlaceListReturn).toHaveLength(2)
    expect(filtered.getPlaceListReturn[0].id).toEqual(result.getPlaceListReturn[0].id)
  },
  30_000,
)
