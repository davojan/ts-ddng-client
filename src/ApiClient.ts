import { SoapClient } from '.'
import * as apiTypes from './apiTypes'

/**
 * High-level api client for drebedengi.ru service
 * Hides ugly SOAP API
 */
export class ApiClient {
  private soapClient: SoapClient

  constructor(apiId: string, login: string, pass: string) {
    this.soapClient = new SoapClient(apiId, login, pass)
  }

  getBalance(params: apiTypes.GetBalanceParams): Promise<apiTypes.GetBalanceResult> {
    return this.soapClient
      .getBalance({
        restDate: params.atDate,
        is_with_accum: params.withoutAccumulations,
        is_with_duty: params.withoutDepts,
      })
      .then(result =>
        result.getBalanceReturn.map(item => ({
          placeId: +item.place_id,
          placeName: item.place_name,
          isDeptAccount: toBool(item.is_for_duty),
          isCreditCard: toBool(item.is_credit_card),
          parentPlaceId: +item.parent_id > 0 ? +item.parent_id : null,
          sum: +item.sum,
          currencyId: +item.currency_id,
          currencyName: item.currency_name,
          isDefaultCurrency: toBool(item.currency_default),
          date: item.date,
          description: item.description,
          sortPosition: +item.sort,
        })),
      )
  }
}

function toBool(value: any): boolean {
  return value === 't' || value === 'true' || value === 'yes'
    ? true
    : value === 'f' || value === 'false' || value === 'no' ? false : Boolean(value)
}
