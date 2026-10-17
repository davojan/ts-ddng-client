import { ChangeAction, ChangeObjectType, changeListFromSoap, currentRevisionFromSoap } from '../src/messages/changes'

test('currentRevisionFromSoap parses the revision number', () => {
  expect(currentRevisionFromSoap({ getCurrentRevisionReturn: '1334793999' })).toBe(1_334_793_999)
})

test('changeListFromSoap maps SOAP changes to high-level changes', () => {
  expect(
    changeListFromSoap({
      getChangeListReturn: [
        { revision: '1304878776', action_id: '1', object_type_id: '1', object_id: '9001', date: '2026-08-22 12:01:16' },
        {
          revision: '1304888977',
          action_id: '2',
          object_type_id: '5',
          object_id: '65342',
          date: '2026-08-22 12:04:03',
        },
      ],
    }),
  ).toEqual([
    {
      revision: 1_304_878_776,
      action: ChangeAction.Add,
      objectType: ChangeObjectType.Record,
      objectId: 9001,
      date: '2026-08-22 12:01:16',
    },
    {
      revision: 1_304_888_977,
      action: ChangeAction.Update,
      objectType: ChangeObjectType.Currency,
      objectId: 65342,
      date: '2026-08-22 12:04:03',
    },
  ])
})

test('changeListFromSoap accepts a single item, a keyed map and an empty result', () => {
  const item = { revision: '7', action_id: '3', object_type_id: '4', object_id: '12', date: '2026-01-01 00:00:00' }
  const expected = [
    { revision: 7, action: ChangeAction.Delete, objectType: ChangeObjectType.Place, objectId: 12, date: item.date },
  ]

  expect(changeListFromSoap({ getChangeListReturn: item })).toEqual(expected)
  expect(changeListFromSoap({ getChangeListReturn: { 0: item, 1: null } })).toEqual(expected)
  expect(changeListFromSoap({ getChangeListReturn: null })).toEqual([])
})
