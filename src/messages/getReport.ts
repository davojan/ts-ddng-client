import { toBool } from '../utils'
import type { GetRecordListParams, GetRecordListSoapParams } from './getRecordList'
import {
  AveragingType,
  GrouppingType,
  RecordType,
  getRecordListParamsToSoap,
} from './getRecordList'

export interface GetReportParams extends Omit<GetRecordListParams, 'recordType'> {
  averaging?: AveragingType
}

export interface IncomeReportItem {
  sourceId: number
  parentSourceId: number | null
  sourceName: string
  amount: number
  currencyId: number
  hasChildren: boolean
}

export interface ExpenseReportItem {
  categoryId: number
  parentCategoryId: number | null
  categoryName: string
  amount: number
  currencyId: number
  hasChildren: boolean
}

export interface GetReportSoapResult {
  getRecordListReturn: GetReportSoapResultValue
}

export interface GetReportSoapResultItem {
  budget_object_id: string
  parent_id: string | null
  name: string
  difference: string
  currency_id: string
  nochild: string
  nick?: string
}

export type GetReportSoapResultValue =
  | GetReportSoapResultItem[]
  | Record<string, GetReportSoapResultItem | null>
  | GetReportSoapResultItem
  | null

export function getIncomeReportParamsToSoap(params: GetReportParams): GetRecordListSoapParams {
  return {
    ...getRecordListParamsToSoap(params),
    r_how: GrouppingType.IncomeBySource,
    r_middle: params.averaging ?? AveragingType.NoAveraging,
    r_what: RecordType.Income,
  }
}

export function getExpenseReportParamsToSoap(params: GetReportParams): GetRecordListSoapParams {
  return {
    ...getRecordListParamsToSoap(params),
    r_how: GrouppingType.ExpenseByCategory,
    r_middle: params.averaging ?? AveragingType.NoAveraging,
    r_what: RecordType.Expense,
  }
}

export function incomeReportFromSoap(soap: GetReportSoapResult): IncomeReportItem[] {
  return normalizeReportSoapValue(soap.getRecordListReturn).map(item => ({
    sourceId: +item.budget_object_id,
    parentSourceId: normalizeParentId(item.parent_id),
    sourceName: item.name,
    amount: Math.abs(+item.difference),
    currencyId: +item.currency_id,
    hasChildren: !toBool(item.nochild),
  }))
}

export function expenseReportFromSoap(soap: GetReportSoapResult): ExpenseReportItem[] {
  return normalizeReportSoapValue(soap.getRecordListReturn).map(item => ({
    categoryId: +item.budget_object_id,
    parentCategoryId: normalizeParentId(item.parent_id),
    categoryName: item.name,
    amount: Math.abs(+item.difference),
    currencyId: +item.currency_id,
    hasChildren: !toBool(item.nochild),
  }))
}

function normalizeReportSoapValue(value: GetReportSoapResultValue): GetReportSoapResultItem[] {
  if (value == null) {
    return []
  }

  if (Array.isArray(value)) {
    return value.filter(x => x)
  }

  if (isReportSoapItem(value)) {
    return [value]
  }

  return Object.values(value).filter(x => x != null)
}

function isReportSoapItem(
  value: GetReportSoapResultItem | Record<string, GetReportSoapResultItem | null>,
): value is GetReportSoapResultItem {
  return typeof value.budget_object_id === 'string'
}

function normalizeParentId(parentId: string | null): number | null {
  return parentId == null || +parentId <= 0 ? null : +parentId
}
