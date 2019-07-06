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

export const getPlaceListParamsToSoap = (params?: GetPlaceListParams): GetPlaceListSoapParams => ({
  // seems that this should always be true, false gives always empty results
  idList: params && params.placeIds && params.placeIds.map(x => String(x)),
})

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
}

export const placeListFromSoap = (soap: GetPlaceListSoapResult): Place[] =>
  soap.getPlaceListReturn.filter(x => x).map(r => ({
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
  }))
