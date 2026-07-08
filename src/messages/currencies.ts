import { toBool } from '../utils'

export interface Currency {
  id: number
  name: string
  course: string
  code: string
  familyId: number
  isDefault: boolean
  isAutoupdate: boolean
  isHidden: boolean
}

export interface GetCurrenciesParams {
  currencyIds?: number[]
}

export interface CreateCurrencyParams {
  name: string
  course: string
  code?: string
  isDefault?: boolean
  isAutoupdate?: boolean
  isHidden?: boolean
}

export interface UpdateCurrencyParams {
  id: number
  name: string
  course: string
  code?: string
  isDefault: boolean
  isAutoupdate: boolean
  isHidden: boolean
}

export class CurrencyValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CurrencyValidationError'
  }
}

export class CurrencyDeleteConflictError extends Error {
  constructor(
    readonly currencyId: number,
    readonly originalError: unknown,
  ) {
    super(`Currency ${currencyId} cannot be deleted because it has linked objects`)
    this.name = 'CurrencyDeleteConflictError'
  }
}

export interface GetCurrencyListSoapParams {
  idList?: string[]
}

export interface GetCurrencyListSoapResult {
  getCurrencyListReturn: GetCurrencyListSoapResultItem[]
}

export interface GetCurrencyListSoapResultItem {
  id: string
  name: string
  course: string
  code: string
  family_id: string
  is_default: string
  is_autoupdate: string
  is_hidden: string
}

export type SetCurrencyListSoapList = SetCurrencyListSoapListItem[]

export interface SetCurrencyListSoapListItem {
  client_id?: number
  server_id?: number
  name: string
  course: string
  code: string
  is_default: boolean
  is_autoupdate: boolean
  is_hidden: boolean
}

export interface SetCurrencyListSoapResult {
  setCurrencyListReturn: SetCurrencyListSoapResultItem[]
}

export interface SetCurrencyListSoapResultItem {
  client_id?: string
  server_id: string
  status: string
}

export const getCurrenciesParamsToSoap = (params?: GetCurrenciesParams): GetCurrencyListSoapParams => ({
  idList: params?.currencyIds?.map(String),
})

export const currencyListFromSoap = (soap: GetCurrencyListSoapResult): Currency[] =>
  soap.getCurrencyListReturn
    .filter(x => x)
    .map(r => ({
      id: +r.id,
      name: r.name,
      course: r.course,
      code: r.code,
      familyId: +r.family_id,
      isDefault: toBool(r.is_default),
      isAutoupdate: toBool(r.is_autoupdate),
      isHidden: toBool(r.is_hidden),
    }))

export function createCurrencyParamsToSoap(params: CreateCurrencyParams): SetCurrencyListSoapListItem {
  const name = normalizeCurrencyName(params.name)
  const course = normalizeCurrencyCourse(params.course)
  const code = normalizeCurrencyCode(params.code)
  validateAutoupdateCode(code, params.isAutoupdate || false)

  return {
    client_id: ++clientIdCounter,
    name,
    course,
    code,
    is_default: params.isDefault || false,
    is_autoupdate: params.isAutoupdate || false,
    is_hidden: params.isHidden || false,
  }
}

export function updateCurrencyParamsToSoap(params: UpdateCurrencyParams): SetCurrencyListSoapListItem {
  const name = normalizeCurrencyName(params.name)
  const course = normalizeCurrencyCourse(params.course)
  const code = normalizeCurrencyCode(params.code)
  validateAutoupdateCode(code, params.isAutoupdate)

  return {
    server_id: params.id,
    name,
    course,
    code,
    is_default: params.isDefault,
    is_autoupdate: params.isAutoupdate,
    is_hidden: params.isHidden,
  }
}

export function isCurrencyDeleteConflict(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase()
  return message.includes('connected') || message.includes('linked') || message.includes('delete them first')
}

function normalizeCurrencyName(name: string): string {
  const normalized = name.trim()

  if (!normalized) {
    throw new CurrencyValidationError('Currency name is required')
  }

  return normalized
}

function normalizeCurrencyCourse(course: string): string {
  const normalized = course.trim()

  if (!normalized) {
    throw new CurrencyValidationError('Currency course is required')
  }

  return normalized
}

function normalizeCurrencyCode(code: string | undefined): string {
  return code?.trim() || ''
}

function validateAutoupdateCode(code: string, isAutoupdate: boolean): void {
  if (isAutoupdate && !code) {
    throw new CurrencyValidationError('Currency code is required when autoupdate is enabled')
  }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

let clientIdCounter = 0
