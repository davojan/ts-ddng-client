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

export interface CreateIncomeParams extends CreateRecordParams {
  sourceId: number
}

export const createIncomeParamsToSoap = (params: CreateIncomeParams): SetRecordListSoapListItem => ({
  ...createRecordParamsToSoap(params),
  client_id: createRecordClientId1,
  operation_type: RecordType.Income,
  budget_object_id: params.sourceId,
})

// createExpence

export interface CreateExpenceParams extends CreateRecordParams {
  categoryId: number
}

export const createExpenceParamsToSoap = (params: CreateExpenceParams): SetRecordListSoapListItem => ({
  ...createRecordParamsToSoap(params),
  client_id: createRecordClientId1,
  operation_type: RecordType.Expence,
  budget_object_id: params.categoryId,
})

// createMove

export interface CreateMoveParams extends CreateRecordParams {
  fromPlaceId: number
}

export const createMoveParamsToSoap = (
  params: CreateMoveParams,
): [SetRecordListSoapListItem, SetRecordListSoapListItem] => {
  const common = { ...createRecordParamsToSoap(params), operation_type: RecordType.Move }
  const toRecord = {
    ...common,
    client_id: createRecordClientId1,
    client_move_id: createRecordClientId2,
    place_id: params.placeId,
    budget_object_id: params.fromPlaceId,
  }
  const fromRecord = {
    ...common,
    client_id: createRecordClientId2,
    client_move_id: createRecordClientId1,
    place_id: params.fromPlaceId,
    budget_object_id: params.placeId,
    sum: -params.sum,
  }
  return [toRecord, fromRecord]
}

// createExchange

export interface CreateExchangeParams extends CreateRecordParams {
  fromCurrencyId: number
  fromSum: number
}

export const createExchangeParamsToSoap = (
  params: CreateExchangeParams,
): [SetRecordListSoapListItem, SetRecordListSoapListItem] => {
  const common = {
    ...createRecordParamsToSoap(params),
    operation_type: RecordType.Exchange,
    budget_object_id: params.placeId,
  }
  const toRecord = {
    ...common,
    client_id: createRecordClientId1,
    currency_id: params.currencyId,
  }
  const fromRecord = {
    ...common,
    client_id: createRecordClientId2,
    client_change_id: createRecordClientId1,
    currency_id: params.fromCurrencyId,
    sum: -params.fromSum,
  }
  return [toRecord, fromRecord]
}

export interface CreateRecordParams {
  placeId: number
  sum: number
  currencyId: number
  dateTime?: string
  comment?: string
}

const createRecordParamsToSoap = ({ placeId, sum, currencyId, dateTime, comment }: CreateRecordParams) => ({
  place_id: placeId,
  currency_id: currencyId,
  operation_date: dateTime || '', // need moment
  is_duty: false,
  sum,
  comment,
})

export const createRecordClientId1 = 1
export const createRecordClientId2 = 2
