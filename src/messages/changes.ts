export enum ChangeAction {
  Add = 1,
  Update,
  Delete,
}

export enum ChangeObjectType {
  Record = 1,
  IncomeSource,
  ExpenseCategory,
  Place,
  Currency,
  Tag,
  Accumulation,
  AccumulationOrder,
}

/** One change of the account's data since a given revision. */
export interface Change {
  revision: number
  action: ChangeAction
  objectType: ChangeObjectType
  /** Id of the changed object, for subsequent getRecordList, getCategoryList, etc. calls. */
  objectId: number
  /** Server time of the change, 'YYYY-MM-DD HH:MM:SS'. */
  date: string
}

export interface GetCurrentRevisionSoapResult {
  getCurrentRevisionReturn: string
}

export interface GetChangeListSoapParams {
  revision: string
}

export interface GetChangeListSoapResult {
  getChangeListReturn: GetChangeListSoapResultValue
}

export type GetChangeListSoapResultValue =
  | GetChangeListSoapResultItem[]
  | Record<string, GetChangeListSoapResultItem | null>
  | GetChangeListSoapResultItem
  | null

export interface GetChangeListSoapResultItem {
  revision: string
  action_id: string
  object_type_id: string
  object_id: string
  date: string
}

export const currentRevisionFromSoap = (soap: GetCurrentRevisionSoapResult): number => +soap.getCurrentRevisionReturn

export const changeListFromSoap = (soap: GetChangeListSoapResult): Change[] =>
  normalizeChangeListSoapValue(soap.getChangeListReturn).map(c => ({
    revision: +c.revision,
    action: +c.action_id,
    objectType: +c.object_type_id,
    objectId: +c.object_id,
    date: c.date,
  }))

function normalizeChangeListSoapValue(value: GetChangeListSoapResultValue): GetChangeListSoapResultItem[] {
  if (value == null) {
    return []
  }

  if (Array.isArray(value)) {
    return value.filter(x => x)
  }

  if (isChangeListSoapItem(value)) {
    return [value]
  }

  return Object.values(value).filter(x => x != null)
}

function isChangeListSoapItem(value: object): value is GetChangeListSoapResultItem {
  return 'revision' in value && 'object_type_id' in value
}
