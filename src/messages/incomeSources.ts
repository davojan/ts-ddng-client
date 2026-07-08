import { toBool } from '../utils'

export interface IncomeSource {
  id: number
  parentId: number | null
  budgetFamilyId: number
  name: string
  isHidden: boolean
  sort: number
  description: string
}

export interface GetIncomeSourcesParams {
  sourceIds?: number[]
}

export interface CreateIncomeSourceParams {
  name: string
  parentId?: number | null
  isHidden?: boolean
  sort?: number
  description?: string
}

export interface UpdateIncomeSourceParams {
  id: number
  name: string
  parentId?: number | null
  isHidden: boolean
  sort: number
  description?: string
}

export class IncomeSourceValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'IncomeSourceValidationError'
  }
}

export class IncomeSourceDeleteConflictError extends Error {
  constructor(
    readonly sourceId: number,
    readonly originalError: unknown,
  ) {
    super(`Income source ${sourceId} cannot be deleted because it has linked objects`)
    this.name = 'IncomeSourceDeleteConflictError'
  }
}

export interface GetSourceListSoapParams {
  idList?: string[]
}

export interface GetSourceListSoapResult {
  getSourceListReturn: GetSourceListSoapResultItem[]
}

export interface GetSourceListSoapResultItem {
  id: string
  parent_id: string
  budget_family_id: string
  type: string
  name: string
  is_hidden: string
  sort: string
  description?: string | null
}

export type SetSourceListSoapList = SetSourceListSoapListItem[]

export interface SetSourceListSoapListItem {
  client_id?: number
  server_id?: number
  parent_id: number
  name: string
  is_hidden: boolean
  is_for_duty: boolean
  sort: number
  description: string
}

export interface SetSourceListSoapResult {
  setSourceListReturn: SetSourceListSoapResultItem[]
}

export interface SetSourceListSoapResultItem {
  client_id?: string
  server_id: string
  status: string
}

export const getIncomeSourcesParamsToSoap = (params?: GetIncomeSourcesParams): GetSourceListSoapParams => ({
  idList: params?.sourceIds?.map(String),
})

export const incomeSourceListFromSoap = (soap: GetSourceListSoapResult): IncomeSource[] =>
  soap.getSourceListReturn
    .filter(x => x)
    .map(r => ({
      id: +r.id,
      parentId: r.parent_id == null || +r.parent_id <= 0 ? null : +r.parent_id,
      budgetFamilyId: +r.budget_family_id,
      name: r.name,
      isHidden: toBool(r.is_hidden),
      sort: +r.sort,
      description: r.description || '',
    }))

export function createIncomeSourceParamsToSoap(params: CreateIncomeSourceParams): SetSourceListSoapListItem {
  const name = normalizeIncomeSourceName(params.name)

  return {
    client_id: ++clientIdCounter,
    parent_id: normalizeParentId(params.parentId),
    name,
    is_hidden: params.isHidden || false,
    is_for_duty: false,
    sort: params.sort || 0,
    description: params.description || '',
  }
}

export function updateIncomeSourceParamsToSoap(params: UpdateIncomeSourceParams): SetSourceListSoapListItem {
  const name = normalizeIncomeSourceName(params.name)

  if (params.parentId === params.id) {
    throw new IncomeSourceValidationError('Income source cannot be its own parent')
  }

  return {
    server_id: params.id,
    parent_id: normalizeParentId(params.parentId),
    name,
    is_hidden: params.isHidden,
    is_for_duty: false,
    sort: params.sort,
    description: params.description || '',
  }
}

export function isIncomeSourceDeleteConflict(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase()
  return message.includes('connected') || message.includes('linked') || message.includes('delete them first')
}

function normalizeIncomeSourceName(name: string): string {
  const normalized = name.trim()

  if (!normalized) {
    throw new IncomeSourceValidationError('Income source name is required')
  }

  return normalized
}

function normalizeParentId(parentId: number | null | undefined): number {
  return parentId == null ? -1 : parentId
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

let clientIdCounter = Date.now()
