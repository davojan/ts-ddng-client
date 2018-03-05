/**
 * Retrievs record list (array of arrays) or report table by parameters;
 * [params] => array of following parameters:
 *   'is_report' [true|false (no default)] - retrievs data for report only or full records
 *       (waste, incomes, moves, changes) for export;
 *   'relative_date' [YYYY-MM-DD (NOW by default)] - all data will be retrieved relative to this value, according
 *       to 'r_period' value;
 *   'period_to', 'period_from' [YYYY-MM-DD] - custom period, if 'r_period' = 0;
 *   'is_show_duty' [true(default)|false] - whether or not include duty record;
 *   'r_period' [custom period = 0, this month = 1, today = 7, last month = 2, this quart = 3, this year = 4,
 *       last year = 5, all time = 6, last 20 record = 8 (default)] - period for which data will be obtained;
 *   'r_what' [income = 2, waste = 3 (default), move = 4, change = 5, all types = 6] - type of data you want to get;
 *   'r_who' [0 (default) - all users, int8 = user ID] - The data of the user to obtain,
 *       in the case of multiplayer mode;
 *   'r_how' [show record list by detail = 1 (default), group incomes by source = 2, group wastes by category = 3] -
 *       Values 2 and 3 are for 'report' mode only# How to group the result record list;
 *   'r_middle' [No average = 0 (default), Average monthly = 2592000, Average weekly = 604800,
 *       Averaged over days = 86400] - How to average the data, if r_how = 2 or 3;
 *   'r_currency' [Original currency = 0 (default), int8 = currency ID] - Convert or not in to given currency;
 *   'r_is_place', 'r_is_tag', 'r_is_category' [Include all = 0 (default), Include only selected = 1,
 *       All except selected = 2] - Exclude or include 'r_place', 'r_tag' or 'r_category' respectively;
 *   'r_place', 'r_tag', 'r_category' [Array] - Array of numeric values for place ID, tag ID
 *       or category ID respectively;
 *
 * If parameter [idList] is given, it will be treat as ID list of objects to retrieve# this is used for synchronization;
 */

export enum PeriodType {
  Custom,
  ThisMonth,
  LastMonth,
  ThisQuarter,
  ThisYear,
  LastYear,
  AllTime,
  Today,
  Last20Records,
}

export enum RecordType {
  Income = 2,
  Expence,
  Move,
  Exchange,
}

export type RecordTypeAll = 6

export enum GrouppingType {
  NoGroupping = 1,
  IncomeBySource,
  ExcpenceByCategory,
}

export enum AveragingType {
  NoAveraging = 0,
  Daily = 86400,
  Weekly = 604800,
  Monthly = 2592000,
}

export enum FilterType {
  All,
  OnlySelected,
  ExceptSelected,
}

export interface GetRecordListSoapParams {
  is_report?: boolean

  r_period?: PeriodType
  period_from?: string
  period_to?: string
  relative_date?: string

  r_how?: GrouppingType
  r_what?: RecordType | RecordTypeAll
  is_show_duty?: boolean
  r_who?: number

  r_currency?: number
  r_middle?: AveragingType

  r_is_place?: FilterType
  r_place?: number[]

  r_is_tag?: FilterType
  r_tag?: number[]

  r_is_category?: FilterType
  r_category?: number[]
}

export interface GetRecordListSoapResult {
  getRecordListReturn: GetRecordListSoapResultItem[]
}

export interface GetRecordListSoapResultItem {
  id: string
  id2?: string
  budget_account_id: string
  budget_object_id: string
  name: string
  difference: string
  user_nuid: string
  budget_family_id: string
  is_duty: string
  operation_date: string
  comment?: string
  currency_id: string
  group_id: string | null
  operation_type: string
  oper_timestamp: string
}

export interface GetRecordListResultItem {
  placeId: number
  budgetAccountId: number
  budgetObjectId: number
  budgetFamilyId: number
  categoryName: string // or account name
  sum: number
  userId: number
  isDept: boolean
  dateTime: string
  comment: string
  currencyId: number
  groupId: number | null
  operationType: RecordType
  timestamp: number
}
