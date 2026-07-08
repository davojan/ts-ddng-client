import { toBool } from '../utils'

/**
 * Retrievs place list (array of arrays):
 *   [id] => Internal place ID;
 *   [budget_family_id] => User family ID (for multiuser mode);
 *   [type] => Type of object, 4 - places;
 *   [name] => Place name given by user;
 *   [is_hidden] => is place hidden in user interface;
 *   [is_autohide] => debts will auto hide on null balance;
 *   [is_for_duty] => Internal place for duty logic, Auto created while user adds "Waste or income duty";
 *   [sort] => User sort of place list;
 *   [purse_of_nuid] => Not empty if place is purse of user# The value is internal user ID;
 *   [icon_id] => Place icon ID from http://www(dot)drebedengi(dot)ru/img/pl[icon_id](dot)gif;
 * If parameter [idList] is given, it will be treat as ID list of objects to retrieve# this is used for synchronization;
 * There is may be empty response, if user access level is limited;
 */

export interface GetPlaceListSoapParams {
  idList?: string[]
}

export interface GetPlaceListParams {
  placeIds?: number[]
}

export type GetPlacesParams = GetPlaceListParams

export interface CreatePlaceParams {
  name: string
  parentId?: number | null
  isHidden?: boolean
  isForDuty?: boolean
  isAutohide?: boolean
  sort?: number
  iconId?: number | null
}

export interface UpdatePlaceParams {
  id: number
  name: string
  parentId?: number | null
  isHidden: boolean
  isAutohide: boolean
  sort: number
  iconId?: number | null
}

export class PlaceValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PlaceValidationError'
  }
}

export class PlaceDeleteConflictError extends Error {
  constructor(
    readonly placeId: number,
    readonly originalError: unknown,
  ) {
    super(`Place ${placeId} cannot be deleted because it has linked objects`)
    this.name = 'PlaceDeleteConflictError'
  }
}

export const getPlacesParamsToSoap = (params?: GetPlacesParams): GetPlaceListSoapParams => ({
  // seems that this should always be true, false gives always empty results
  idList: params && params.placeIds && params.placeIds.map(x => String(x)),
})

export const getPlaceListParamsToSoap = getPlacesParamsToSoap

export interface GetPlaceListSoapResult {
  getPlaceListReturn: GetPlaceListSoapResultItem[]
}

export interface GetPlaceListSoapResultItem {
  id: string
  budget_family_id: string
  type: string
  name: string
  is_hidden: string
  is_autohide: string
  is_for_duty: string
  is_credit_card: string
  sort: string
  purse_of_nuid?: string | null
  icon_id: string | null
  parent_id: string
}

export interface Place {
  id: number
  budgetFamilyId: number
  name: string
  isHidden: boolean
  isAutohide: boolean
  isForDuty: boolean
  isCreditCard: boolean
  purseUserId: number | null
  iconId: number | null
  iconUrl: string | null
  parentId: number | null
  sort: number
}

export type SetPlaceListSoapList = SetPlaceListSoapListItem[]

export interface SetPlaceListSoapListItem {
  client_id?: number
  server_id?: number
  parent_id: number
  name: string
  is_hidden: boolean
  is_autohide: boolean
  is_for_duty: boolean
  is_credit_card: boolean
  sort: number
  icon_id: number
}

export interface SetPlaceListSoapResult {
  setPlaceListReturn: SetPlaceListSoapResultItem[]
}

export interface SetPlaceListSoapResultItem {
  client_id?: string
  server_id: string
  status: string
}

export const placeListFromSoap = (soap: GetPlaceListSoapResult): Place[] =>
  soap.getPlaceListReturn
    .filter(x => x)
    .map(r => ({
      id: +r.id,
      budgetFamilyId: +r.budget_family_id,
      name: r.name,
      isHidden: toBool(r.is_hidden),
      isAutohide: toBool(r.is_autohide),
      isForDuty: toBool(r.is_for_duty),
      isCreditCard: toBool(r.is_credit_card),
      purseUserId: r.purse_of_nuid == null ? null : +r.purse_of_nuid,
      iconId: r.icon_id == null ? null : +r.icon_id,
      iconUrl: r.icon_id == null ? null : `http://www.drebedengi.ru/img/pl${r.icon_id}.gif`,
      parentId: r.parent_id == null || +r.parent_id <= 0 ? null : +r.parent_id,
      sort: +r.sort,
    }))

export function createPlaceParamsToSoap(params: CreatePlaceParams): SetPlaceListSoapListItem {
  const name = normalizePlaceName(params.name)

  return {
    client_id: ++clientIdCounter,
    parent_id: normalizeParentId(params.parentId),
    name,
    is_hidden: params.isHidden || false,
    is_autohide: params.isAutohide || false,
    is_for_duty: params.isForDuty || false,
    is_credit_card: false,
    sort: params.sort || 0,
    icon_id: normalizeIconId(params.iconId),
  }
}

export function updatePlaceParamsToSoap(params: UpdatePlaceSoapParams): SetPlaceListSoapListItem {
  const name = normalizePlaceName(params.name)

  if (params.parentId === params.id) {
    throw new PlaceValidationError('Place cannot be its own parent')
  }

  return {
    server_id: params.id,
    parent_id: normalizeParentId(params.parentId),
    name,
    is_hidden: params.isHidden,
    is_autohide: params.isAutohide,
    is_for_duty: params.isForDuty,
    is_credit_card: false,
    sort: params.sort,
    icon_id: normalizeIconId(params.iconId),
  }
}

export function isPlaceDeleteConflict(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase()
  return message.includes('connected') || message.includes('linked') || message.includes('delete them first')
}

function normalizePlaceName(name: string): string {
  const normalized = name.trim()

  if (!normalized) {
    throw new PlaceValidationError('Place name is required')
  }

  return normalized
}

function normalizeParentId(parentId: number | null | undefined): number {
  return parentId == null ? -1 : parentId
}

function normalizeIconId(iconId: number | null | undefined): number {
  return iconId == null ? 0 : iconId
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

interface UpdatePlaceSoapParams extends UpdatePlaceParams {
  isForDuty: boolean
}

let clientIdCounter = 0
