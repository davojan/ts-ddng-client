import type {
  ExchangeSpecificFields,
  ExpenseSpecificFields,
  IncomeSpecificFields,
  MoveSpecificFields,
} from '../FinanceOperation'
import { FinanceOperationValidationError } from '../FinanceOperation'
import { RecordType } from './getRecordList'

/**
 * Insert or update record list;
 *   [list] => array (indexes must be 0,1,2...N) of arrays:
 *     'server_id' or 'client_id' [int8] - server or client ID of the record
 *       # If client ID is present - try to insert new record, and return server2client correspondence
 *         in the result array
 *       # If server_id is present - try to update existing record;
 *     'server_move_id' or 'client_move_id' [int8] - for "move" operations only, to identify second part of move
 *       # The value must point to first part 'server_id' or 'client_id' respectively;
 *     'server_change_id' or 'client_change_id' [int8] - for "currency change" operations only,
 *       to identify second part of change
 *       # The value must point to first part 'server_id' or 'client_id' respectively;
 *     'place_id' [int8] - place ID, of which the record;
 *     'budget_object_id' [int8] - object ID of which the record:
 *       category ID for waste,
 *       source ID for incomes,
 *       place ID for moves and currency changes;
 *     'sum' [int8] - absolute value of sum (hundredths);
 *     'operation_date' [YYYY-MM-DD HH:mm:SS] - transaction date;
 *     'comment' [UTF8 text] - the comment of the record, 2048 chars max length;
 *     'currency_id' [int8] - currency ID of the record;
 *     'is_duty' [true|false] - not used;
 *     'operation_type' [income = 2, waste = 3 (default), move = 4, change = 5] - transaction type;
 * Returns the array of server IDs, successfully changed;
 * The client MUST save server IDs corresponded to client IDs, for subsequent 'update' and 'delete' calls;
 */

export type SetRecordListSoapList = SetRecordListSoapListItem[]

export interface SetRecordListSoapListItem {
  client_id?: number
  client_move_id?: number
  client_change_id?: number

  server_id?: number
  server_move_id?: number
  server_change_id?: number

  operation_type: RecordType
  place_id: number
  budget_object_id: number
  sum: number
  currency_id: number
  operation_date: string
  is_duty: boolean

  comment?: string
}

export type SetRecordListSoapResult = { setRecordListReturn: SetRecordListSoapResultItem[] }

export interface SetRecordListSoapResultItem {
  client_id: string
  server_id: string
  status: string
}

// createIncome

export interface CreateIncomeParams extends CreateRecordParams, IncomeSpecificFields {}

export const createIncomeParamsToSoap = (params: CreateIncomeParams): SetRecordListSoapListItem => ({
  ...createRecordParamsToSoap(params),
  client_id: ++clientIdCounter,
  operation_type: RecordType.Income,
  budget_object_id: normalizeId(params.sourceId, 'Income source id'),
})

export interface UpdateIncomeParams extends CreateIncomeParams {
  id: number
}

export const updateIncomeParamsToSoap = (params: UpdateIncomeParams): SetRecordListSoapListItem => ({
  ...updateRecordParamsToSoap(params),
  operation_type: RecordType.Income,
  budget_object_id: normalizeId(params.sourceId, 'Income source id'),
})

// createExpense

export interface CreateExpenseParams extends CreateRecordParams, ExpenseSpecificFields {}

export const createExpenseParamsToSoap = (params: CreateExpenseParams): SetRecordListSoapListItem => ({
  ...createRecordParamsToSoap(params),
  client_id: ++clientIdCounter,
  operation_type: RecordType.Expense,
  budget_object_id: normalizeId(params.categoryId, 'Expense category id'),
})

export interface UpdateExpenseParams extends CreateExpenseParams {
  id: number
}

export const updateExpenseParamsToSoap = (params: UpdateExpenseParams): SetRecordListSoapListItem => ({
  ...updateRecordParamsToSoap(params),
  operation_type: RecordType.Expense,
  budget_object_id: normalizeId(params.categoryId, 'Expense category id'),
})

// createMove

export interface CreateMoveParams extends CreateRecordParams, MoveSpecificFields {}

export const createMoveParamsToSoap = (
  params: CreateMoveParams,
): [SetRecordListSoapListItem, SetRecordListSoapListItem] => {
  const common = { ...createRecordParamsToSoap(params), operation_type: RecordType.Move }
  const toId = ++clientIdCounter
  const fromId = ++clientIdCounter

  validateDifferentIds(params.placeId, params.fromPlaceId, 'Move source and destination places must be different')

  const toRecord = {
    ...common,
    client_id: toId,
    client_move_id: fromId,
    place_id: normalizeId(params.placeId, 'Move destination place id'),
    budget_object_id: normalizeId(params.fromPlaceId, 'Move source place id'),
  }
  const fromRecord = {
    ...common,
    client_id: fromId,
    client_move_id: toId,
    place_id: normalizeId(params.fromPlaceId, 'Move source place id'),
    budget_object_id: normalizeId(params.placeId, 'Move destination place id'),
    sum: -normalizeAmount(params.sum, 'Move amount'),
  }
  return [toRecord, fromRecord]
}

export interface UpdateMoveParams extends CreateMoveParams {
  id: number
}

export interface UpdateMoveSoapParams extends UpdateMoveParams {
  linkedRecordId: number
}

export const updateMoveParamsToSoap = (
  params: UpdateMoveSoapParams,
): [SetRecordListSoapListItem, SetRecordListSoapListItem] => {
  const common = { ...updateRecordParamsToSoap(params), operation_type: RecordType.Move }

  validateDifferentIds(params.placeId, params.fromPlaceId, 'Move source and destination places must be different')

  return [
    {
      ...common,
      server_move_id: params.linkedRecordId,
      budget_object_id: normalizeId(params.fromPlaceId, 'Move source place id'),
    },
    {
      ...common,
      server_id: params.linkedRecordId,
      server_move_id: params.id,
      place_id: normalizeId(params.fromPlaceId, 'Move source place id'),
      budget_object_id: normalizeId(params.placeId, 'Move destination place id'),
      sum: -normalizeAmount(params.sum, 'Move amount'),
    },
  ]
}

// createExchange

export interface CreateExchangeParams extends CreateRecordParams, ExchangeSpecificFields {}

export const createExchangeParamsToSoap = (
  params: CreateExchangeParams,
): [SetRecordListSoapListItem, SetRecordListSoapListItem] => {
  const common = {
    ...createRecordParamsToSoap(params),
    operation_type: RecordType.Exchange,
    budget_object_id: params.placeId,
  }
  const toId = ++clientIdCounter
  const fromId = ++clientIdCounter

  validateDifferentIds(
    params.currencyId,
    params.fromCurrencyId,
    'Exchange source and destination currencies must be different',
  )

  const toRecord = {
    ...common,
    client_id: toId,
    client_change_id: fromId,
    currency_id: normalizeId(params.currencyId, 'Exchange destination currency id'),
  }
  const fromRecord = {
    ...common,
    client_id: fromId,
    client_change_id: toId,
    currency_id: normalizeId(params.fromCurrencyId, 'Exchange source currency id'),
    sum: -normalizeAmount(params.fromSum, 'Exchange source amount'),
  }
  return [toRecord, fromRecord]
}

export interface UpdateExchangeParams extends CreateExchangeParams {
  id: number
}

export interface UpdateExchangeSoapParams extends UpdateExchangeParams {
  linkedRecordId: number
}

export const updateExchangeParamsToSoap = (
  params: UpdateExchangeSoapParams,
): [SetRecordListSoapListItem, SetRecordListSoapListItem] => {
  const common = {
    ...updateRecordParamsToSoap(params),
    operation_type: RecordType.Exchange,
    budget_object_id: normalizeId(params.placeId, 'Exchange place id'),
  }

  validateDifferentIds(
    params.currencyId,
    params.fromCurrencyId,
    'Exchange source and destination currencies must be different',
  )

  return [
    {
      ...common,
      server_change_id: params.linkedRecordId,
      currency_id: normalizeId(params.currencyId, 'Exchange destination currency id'),
    },
    {
      ...common,
      server_id: params.linkedRecordId,
      server_change_id: params.id,
      currency_id: normalizeId(params.fromCurrencyId, 'Exchange source currency id'),
      sum: -normalizeAmount(params.fromSum, 'Exchange source amount'),
    },
  ]
}

export interface CreateRecordParams {
  placeId: number
  sum: number
  currencyId: number
  dateTime?: string
  comment?: string
}

const createRecordParamsToSoap = ({ placeId, sum, currencyId, dateTime, comment }: CreateRecordParams) => ({
  place_id: normalizeId(placeId, 'Place id'),
  currency_id: normalizeId(currencyId, 'Currency id'),
  operation_date: dateTime || new Date().toISOString(),
  is_duty: false,
  sum: normalizeAmount(sum, 'Operation amount'),
  comment: comment || '',
})

const updateRecordParamsToSoap = ({ id, placeId, sum, currencyId, dateTime, comment }: UpdateRecordParams) => ({
  ...createRecordParamsToSoap({ placeId, sum, currencyId, dateTime, comment }),
  server_id: normalizeId(id, 'Operation id'),
})

interface UpdateRecordParams extends CreateRecordParams {
  id: number
}

function normalizeId(id: number, fieldName: string): number {
  if (!Number.isInteger(id) || id <= 0) {
    throw new FinanceOperationValidationError(`${fieldName} must be a positive integer`)
  }

  return id
}

function normalizeAmount(sum: number, fieldName: string): number {
  if (!Number.isFinite(sum) || sum <= 0) {
    throw new FinanceOperationValidationError(`${fieldName} must be positive`)
  }

  return sum
}

function validateDifferentIds(id1: number, id2: number, message: string): void {
  if (id1 === id2) {
    throw new FinanceOperationValidationError(message)
  }
}

/**
 * Drebedengi treats client_id as an idempotency key, so it must not restart from 1 in each process.
 */
let clientIdCounter = Date.now()
