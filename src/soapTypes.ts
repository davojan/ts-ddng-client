import { GetRecordListSoapParams, GetRecordListSoapResult } from './messages/getRecordList'
import { SetRecordListSoapList, SetRecordListSoapResult } from './messages/setRecordList'

export interface AsyncDdngClient {
  getBalanceAsync: (args: AuthArgs & { params?: GetBalanceParams }) => Promise<GetBalanceResult>
  getRecordListAsync: (args: AuthArgs & { params?: GetRecordListSoapParams }) => Promise<GetRecordListSoapResult>
  setRecordListAsync: (args: AuthArgs & { list?: SetRecordListSoapList }) => Promise<SetRecordListSoapResult>
}

export interface AuthArgs {
  apiId: string
  login: string
  pass: string
}

export interface GetBalanceParams {
  restDate?: string
  is_with_accum?: boolean
  is_with_duty?: boolean
}

export interface GetBalanceResult {
  getBalanceReturn: GetBalanceResultItem[]
}

export interface GetBalanceResultItem {
  sum: string
  currency_id: string
  place_id: string
  date: string
  is_for_duty: string
  is_credit_card: string
  description: string | null
  place_name: string
  currency_name: string
  currency_default: string
  parent_id: string
  sort: string
}
