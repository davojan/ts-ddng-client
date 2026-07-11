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
  GetCurrencyListSoapParams,
  GetCurrencyListSoapResult,
  SetCurrencyListSoapList,
  SetCurrencyListSoapResult,
} from './messages/currencies'
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
import type {
  GetTagListSoapParams,
  GetTagListSoapResult,
  SetTagListSoapList,
  SetTagListSoapResult,
} from './messages/tags'

export interface AsyncDdngClient {
  lastRequest?: string
  deleteObjectAsync: (args: AuthArgs & DeleteObjectSoapParams) => Promise<DeleteObjectSoapResult>
  getBalanceAsync: (args: AuthArgs & { params?: GetBalanceSoapParams }) => Promise<GetBalanceSoapResult>
  getCategoryListAsync: (args: AuthArgs & GetCategoryListSoapParams) => Promise<GetCategoryListSoapResult>
  getCurrencyListAsync: (args: AuthArgs & GetCurrencyListSoapParams) => Promise<GetCurrencyListSoapResult>
  getPlaceListAsync: (args: AuthArgs & GetPlaceListSoapParams) => Promise<GetPlaceListSoapResult>
  getRecordListAsync: (
    args: AuthArgs & { idList?: number[]; params?: GetRecordListSoapParams },
  ) => Promise<GetRecordListSoapResult>
  getSourceListAsync: (args: AuthArgs & GetSourceListSoapParams) => Promise<GetSourceListSoapResult>
  getTagListAsync: (args: AuthArgs & GetTagListSoapParams) => Promise<GetTagListSoapResult>
  setCategoryListAsync: (args: AuthArgs & { list?: SetCategoryListSoapList }) => Promise<SetCategoryListSoapResult>
  setCurrencyListAsync: (args: AuthArgs & { list?: SetCurrencyListSoapList }) => Promise<SetCurrencyListSoapResult>
  setPlaceListAsync: (args: AuthArgs & { list?: SetPlaceListSoapList }) => Promise<SetPlaceListSoapResult>
  setRecordListAsync: (args: AuthArgs & { list?: SetRecordListSoapList }) => Promise<SetRecordListSoapResult>
  setSourceListAsync: (args: AuthArgs & { list?: SetSourceListSoapList }) => Promise<SetSourceListSoapResult>
  setTagListAsync: (args: AuthArgs & { list?: SetTagListSoapList }) => Promise<SetTagListSoapResult>
}

export interface AuthArgs {
  apiId: string
  login: string
  pass: string
}
