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

export type SetRecordListSoapResult = any
