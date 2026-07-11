import {
  TagValidationError,
  createTagParamsToSoap,
  getTagsParamsToSoap,
  tagListFromSoap,
  updateTagParamsToSoap,
} from '../src/messages/tags'

test('tagListFromSoap maps SOAP tag records to high-level tags', () => {
  expect(
    tagListFromSoap({
      getTagListReturn: [
        {
          family_id: '5',
          id: '40001',
          is_family: 't',
          is_hidden: 'f',
          name: 'Holiday',
          parent_id: '-1',
          sort: '42',
          user_id: '1000000000539',
        },
      ],
    }),
  ).toEqual([
    {
      familyId: 5,
      id: 40001,
      isFamily: true,
      isHidden: false,
      name: 'Holiday',
      parentId: null,
      sort: 42,
      userId: 1_000_000_000_539,
    },
  ])
})

test('getTagsParamsToSoap converts ids for idList filtering', () => {
  expect(getTagsParamsToSoap({ tagIds: [1, 2] })).toEqual({ idList: ['1', '2'] })
})

test('createTagParamsToSoap creates a Drebedengi tag map', () => {
  expect(
    createTagParamsToSoap({
      isFamily: true,
      isHidden: true,
      name: '  Test  ',
      parentId: 10,
      sort: 20,
    }),
  ).toMatchObject({
    is_family: true,
    is_hidden: true,
    name: 'Test',
    parent_id: 10,
    sort: 20,
  })
})

test('updateTagParamsToSoap rejects self-parenting', () => {
  expect(() =>
    updateTagParamsToSoap({
      id: 10,
      isFamily: false,
      isHidden: false,
      name: 'Test',
      parentId: 10,
      sort: 1,
    }),
  ).toThrow(TagValidationError)
})

test('createTagParamsToSoap rejects empty names', () => {
  expect(() => createTagParamsToSoap({ name: '  ' })).toThrow(TagValidationError)
})
