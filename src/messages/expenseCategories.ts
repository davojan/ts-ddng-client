import { toBool } from '../utils'

export interface ExpenseCategory {
  id: number
  parentId: number | null
  budgetFamilyId: number
  name: string
  isHidden: boolean
  sort: number
  description: string
}

export interface GetExpenseCategoriesParams {
  categoryIds?: number[]
}

export interface CreateExpenseCategoryParams {
  name: string
  parentId?: number | null
  isHidden?: boolean
  sort?: number
  description?: string
}

export interface UpdateExpenseCategoryParams {
  id: number
  name: string
  parentId?: number | null
  isHidden: boolean
  sort: number
  description?: string
}

export class ExpenseCategoryValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ExpenseCategoryValidationError'
  }
}

export class ExpenseCategoryDeleteConflictError extends Error {
  constructor(
    readonly categoryId: number,
    readonly originalError: unknown,
  ) {
    super(`Expense category ${categoryId} cannot be deleted because it has linked objects`)
    this.name = 'ExpenseCategoryDeleteConflictError'
  }
}

export interface GetCategoryListSoapParams {
  idList?: string[]
}

export interface GetCategoryListSoapResult {
  getCategoryListReturn: GetCategoryListSoapResultItem[]
}

export interface GetCategoryListSoapResultItem {
  id: string
  parent_id: string
  budget_family_id: string
  type: string
  name: string
  is_hidden: string
  sort: string
  description?: string | null
}

export type SetCategoryListSoapList = SetCategoryListSoapListItem[]

export interface SetCategoryListSoapListItem {
  client_id?: number
  server_id?: number
  parent_id: number
  name: string
  is_hidden: boolean
  is_for_duty: boolean
  sort: number
  description: string
}

export interface SetCategoryListSoapResult {
  setCategoryListReturn: SetCategoryListSoapResultItem[]
}

export interface SetCategoryListSoapResultItem {
  client_id?: string
  server_id: string
  status: string
}

export interface DeleteObjectSoapParams {
  id: number
  type: 'change' | 'currency' | 'income' | 'move' | 'object' | 'waste'
}

export interface DeleteObjectSoapResult {
  deleteObjectReturn: string
}

export const getExpenseCategoriesParamsToSoap = (params?: GetExpenseCategoriesParams): GetCategoryListSoapParams => ({
  idList: params?.categoryIds?.map(String),
})

export const expenseCategoryListFromSoap = (soap: GetCategoryListSoapResult): ExpenseCategory[] =>
  soap.getCategoryListReturn
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

export function createExpenseCategoryParamsToSoap(params: CreateExpenseCategoryParams): SetCategoryListSoapListItem {
  const name = normalizeExpenseCategoryName(params.name)

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

export function updateExpenseCategoryParamsToSoap(params: UpdateExpenseCategoryParams): SetCategoryListSoapListItem {
  const name = normalizeExpenseCategoryName(params.name)

  if (params.parentId === params.id) {
    throw new ExpenseCategoryValidationError('Expense category cannot be its own parent')
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

export function isExpenseCategoryDeleteConflict(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase()
  return message.includes('connected') || message.includes('linked') || message.includes('delete them first')
}

function normalizeExpenseCategoryName(name: string): string {
  const normalized = name.trim()

  if (!normalized) {
    throw new ExpenseCategoryValidationError('Expense category name is required')
  }

  return normalized
}

function normalizeParentId(parentId: number | null | undefined): number {
  return parentId == null ? -1 : parentId
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

let clientIdCounter = 0
