import { FinanceOperationValidationError } from '../src'
import { RecordType } from '../src/messages/getRecordList'
import {
  createExchangeParamsToSoap,
  createMoveParamsToSoap,
  updateExchangeParamsToSoap,
  updateExpenseParamsToSoap,
  updateMoveParamsToSoap,
} from '../src/messages/setRecordList'

test('updateExpenseParamsToSoap writes a single expense record', () => {
  expect(
    updateExpenseParamsToSoap({
      categoryId: 20,
      currencyId: 17,
      dateTime: '2026-07-08 12:00:00',
      id: 10,
      placeId: 30,
      sum: 100,
    }),
  ).toMatchObject({
    budget_object_id: 20,
    currency_id: 17,
    operation_date: '2026-07-08 12:00:00',
    operation_type: RecordType.Expense,
    place_id: 30,
    server_id: 10,
    sum: 100,
  })
})

test('move mappers write positive destination and negative source records', () => {
  expect(createMoveParamsToSoap({ currencyId: 17, fromPlaceId: 20, placeId: 30, sum: 100 })).toMatchObject([
    {
      budget_object_id: 20,
      currency_id: 17,
      operation_type: RecordType.Move,
      place_id: 30,
      sum: 100,
    },
    {
      budget_object_id: 30,
      currency_id: 17,
      operation_type: RecordType.Move,
      place_id: 20,
      sum: -100,
    },
  ])

  expect(
    updateMoveParamsToSoap({ currencyId: 17, fromPlaceId: 20, id: 10, linkedRecordId: 11, placeId: 30, sum: 100 }),
  ).toMatchObject([
    { server_id: 10, server_move_id: 11, sum: 100 },
    { server_id: 11, server_move_id: 10, sum: -100 },
  ])
})

test('exchange mappers write positive destination and negative source records', () => {
  expect(
    createExchangeParamsToSoap({
      currencyId: 17,
      fromCurrencyId: 18,
      fromSum: 200,
      placeId: 30,
      sum: 100,
    }),
  ).toMatchObject([
    {
      currency_id: 17,
      operation_type: RecordType.Exchange,
      place_id: 30,
      sum: 100,
    },
    {
      currency_id: 18,
      operation_type: RecordType.Exchange,
      place_id: 30,
      sum: -200,
    },
  ])

  expect(
    updateExchangeParamsToSoap({
      currencyId: 17,
      fromCurrencyId: 18,
      fromSum: 200,
      id: 10,
      linkedRecordId: 11,
      placeId: 30,
      sum: 100,
    }),
  ).toMatchObject([
    { server_change_id: 11, server_id: 10, sum: 100 },
    { server_change_id: 10, server_id: 11, sum: -200 },
  ])
})

test('operation mappers reject non-positive amounts', () => {
  expect(() => createMoveParamsToSoap({ currencyId: 17, fromPlaceId: 20, placeId: 30, sum: 0 })).toThrow(
    FinanceOperationValidationError,
  )
})
