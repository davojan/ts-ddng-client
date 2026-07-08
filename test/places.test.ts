import {
  PlaceValidationError,
  createPlaceParamsToSoap,
  getPlacesParamsToSoap,
  placeListFromSoap,
  updatePlaceParamsToSoap,
} from '../src/messages/getPlaceList'

test('placeListFromSoap maps SOAP place records to high-level places', () => {
  expect(
    placeListFromSoap({
      getPlaceListReturn: [
        {
          budget_family_id: '5',
          icon_id: '16',
          id: '40030',
          is_autohide: 't',
          is_credit_card: 'f',
          is_for_duty: 't',
          is_hidden: 't',
          name: 'Cash',
          parent_id: '-1',
          purse_of_nuid: null,
          sort: '42',
          type: '4',
        },
      ],
    }),
  ).toEqual([
    {
      budgetFamilyId: 5,
      iconId: 16,
      iconUrl: 'http://www.drebedengi.ru/img/pl16.gif',
      id: 40030,
      isAutohide: true,
      isCreditCard: false,
      isForDuty: true,
      isHidden: true,
      name: 'Cash',
      parentId: null,
      purseUserId: null,
      sort: 42,
    },
  ])
})

test('getPlacesParamsToSoap converts ids for idList filtering', () => {
  expect(getPlacesParamsToSoap({ placeIds: [1, 2] })).toEqual({
    idList: ['1', '2'],
  })
})

test('createPlaceParamsToSoap creates a Drebedengi place map', () => {
  expect(
    createPlaceParamsToSoap({
      iconId: 16,
      isAutohide: true,
      isForDuty: true,
      isHidden: true,
      name: '  Test  ',
      parentId: 10,
      sort: 20,
    }),
  ).toMatchObject({
    icon_id: 16,
    is_autohide: true,
    is_credit_card: false,
    is_for_duty: true,
    is_hidden: true,
    name: 'Test',
    parent_id: 10,
    sort: 20,
  })
})

test('updatePlaceParamsToSoap rejects self-parenting', () => {
  expect(() =>
    updatePlaceParamsToSoap({
      iconId: 0,
      id: 10,
      isAutohide: false,
      isForDuty: false,
      isHidden: false,
      name: 'Test',
      parentId: 10,
      sort: 1,
    }),
  ).toThrow(PlaceValidationError)
})

test('updatePlaceParamsToSoap preserves existing duty account flag supplied by caller', () => {
  expect(
    updatePlaceParamsToSoap({
      iconId: 0,
      id: 10,
      isAutohide: true,
      isForDuty: true,
      isHidden: false,
      name: 'Test',
      parentId: null,
      sort: 1,
    }),
  ).toMatchObject({
    is_autohide: true,
    is_for_duty: true,
  })
})

test('createPlaceParamsToSoap rejects empty names', () => {
  expect(() => createPlaceParamsToSoap({ name: '  ' })).toThrow(PlaceValidationError)
})
