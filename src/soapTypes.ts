import type { GetBalanceSoapParams, GetBalanceSoapResult } from './messages/getBalance'
import type {
  DeleteObjectSoapParams,
  DeleteObjectSoapResult,
  GetCategoryListSoapParams,
  GetCategoryListSoapResult,
  SetCategoryListSoapList,
  SetCategoryListSoapResult,
} from './messages/expenseCategories'
import type {
  GetPlaceListSoapParams,
  GetPlaceListSoapResult,
  SetPlaceListSoapList,
  SetPlaceListSoapResult,
} from './messages/getPlaceList'
import type { GetRecordListSoapParams, GetRecordListSoapResult } from './messages/getRecordList'
import type {
  GetSourceListSoapParams,
  GetSourceListSoapResult,
  SetSourceListSoapList,
  SetSourceListSoapResult,
} from './messages/incomeSources'
import type { SetRecordListSoapList, SetRecordListSoapResult } from './messages/setRecordList'

export interface AsyncDdngClient {
  lastRequest?: string
  deleteObjectAsync: (args: AuthArgs & DeleteObjectSoapParams) => Promise<DeleteObjectSoapResult>
  getBalanceAsync: (args: AuthArgs & { params?: GetBalanceSoapParams }) => Promise<GetBalanceSoapResult>
  getCategoryListAsync: (args: AuthArgs & GetCategoryListSoapParams) => Promise<GetCategoryListSoapResult>
  getPlaceListAsync: (args: AuthArgs & GetPlaceListSoapParams) => Promise<GetPlaceListSoapResult>
  getRecordListAsync: (args: AuthArgs & { params?: GetRecordListSoapParams }) => Promise<GetRecordListSoapResult>
  getSourceListAsync: (args: AuthArgs & GetSourceListSoapParams) => Promise<GetSourceListSoapResult>
  setCategoryListAsync: (args: AuthArgs & { list?: SetCategoryListSoapList }) => Promise<SetCategoryListSoapResult>
  setPlaceListAsync: (args: AuthArgs & { list?: SetPlaceListSoapList }) => Promise<SetPlaceListSoapResult>
  setRecordListAsync: (args: AuthArgs & { list?: SetRecordListSoapList }) => Promise<SetRecordListSoapResult>
  setSourceListAsync: (args: AuthArgs & { list?: SetSourceListSoapList }) => Promise<SetSourceListSoapResult>
}

export interface AuthArgs {
  apiId: string
  login: string
  pass: string
}
