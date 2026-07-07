import type { GetBalanceSoapParams, GetBalanceSoapResult } from './messages/getBalance'
import type { GetPlaceListSoapParams, GetPlaceListSoapResult } from './messages/getPlaceList'
import type { GetRecordListSoapParams, GetRecordListSoapResult } from './messages/getRecordList'
import type { SetRecordListSoapList, SetRecordListSoapResult } from './messages/setRecordList'

export interface AsyncDdngClient {
  lastRequest?: string
  getBalanceAsync: (args: AuthArgs & { params?: GetBalanceSoapParams }) => Promise<GetBalanceSoapResult>
  getPlaceListAsync: (args: AuthArgs & GetPlaceListSoapParams) => Promise<GetPlaceListSoapResult>
  getRecordListAsync: (args: AuthArgs & { params?: GetRecordListSoapParams }) => Promise<GetRecordListSoapResult>
  setRecordListAsync: (args: AuthArgs & { list?: SetRecordListSoapList }) => Promise<SetRecordListSoapResult>
}

export interface AuthArgs {
  apiId: string
  login: string
  pass: string
}
