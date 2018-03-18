import { GetBalanceSoapParams, GetBalanceSoapResult } from './messages/getBalance'
import { GetRecordListSoapParams, GetRecordListSoapResult } from './messages/getRecordList'
import { SetRecordListSoapList, SetRecordListSoapResult } from './messages/setRecordList'

export interface AsyncDdngClient {
  getBalanceAsync: (args: AuthArgs & { params?: GetBalanceSoapParams }) => Promise<GetBalanceSoapResult>
  getRecordListAsync: (args: AuthArgs & { params?: GetRecordListSoapParams }) => Promise<GetRecordListSoapResult>
  setRecordListAsync: (args: AuthArgs & { list?: SetRecordListSoapList }) => Promise<SetRecordListSoapResult>
}

export interface AuthArgs {
  apiId: string
  login: string
  pass: string
}
