import { GetBalanceSoapParams, GetBalanceSoapResult } from './messages/getBalance'
import { GetPlaceListSoapParams, GetPlaceListSoapResult } from './messages/getPlaceList'
import { GetRecordListSoapParams, GetRecordListSoapResult } from './messages/getRecordList'
import { SetRecordListSoapList, SetRecordListSoapResult } from './messages/setRecordList'

export interface AsyncDdngClient {
  getBalanceAsync: (args: AuthArgs & { params?: GetBalanceSoapParams }) => Promise<GetBalanceSoapResult>

  // TODO: remove GetBalanceSoapResult params. It was copied without thinking too much.
  getCategoryListAsync: (args: AuthArgs) => Promise<GetBalanceSoapResult>

  // TODO: remove GetBalanceSoapResult params. It was copied without thinking too much.
  getCurrencyListAsync: (args: AuthArgs) => Promise<GetBalanceSoapResult>

  getSourceListAsync: (args: AuthArgs) => Promise<any>
  getPlaceListAsync: (args: AuthArgs & GetPlaceListSoapParams) => Promise<GetPlaceListSoapResult>
  getRecordListAsync: (args: AuthArgs & { params?: GetRecordListSoapParams }) => Promise<GetRecordListSoapResult>
  setRecordListAsync: (args: AuthArgs & { list?: SetRecordListSoapList }) => Promise<SetRecordListSoapResult>
}

export interface AuthArgs {
  apiId: string
  login: string
  pass: string
}
