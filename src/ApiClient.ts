import { SoapClient } from '.'
import * as apiTypes from './apiTypes'
import {
  CreateExpenceParams,
  createExpenceParamsToSoap,
  createRecordClientId1,
  CreateIncomeParams,
  createIncomeParamsToSoap,
  createRecordClientId2,
  createMoveParamsToSoap,
  CreateMoveParams,
  CreateExchangeParams,
  createExchangeParamsToSoap,
} from './messages/setRecordList'

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

  /**
   * Creates a single income record
   * @returns created record server ID
   */
  createIncome(params: CreateIncomeParams): Promise<number> {
    return this.soapClient.setRecordList([createIncomeParamsToSoap(params)]).then(({ setRecordListReturn: result }) => {
      if (
        result.length === 1 &&
        result[0].client_id === String(createRecordClientId1) &&
        result[0].status === 'inserted'
      ) {
        return +result[0].server_id
      } else {
        throw new Error(`Unexpected response during create income record: ${JSON.stringify(result)}`)
      }
    })
  }

  /**
   * Creates a single expence record
   * @returns created record server ID
   */
  createExpence(params: CreateExpenceParams): Promise<number> {
    return this.soapClient
      .setRecordList([createExpenceParamsToSoap(params)])
      .then(({ setRecordListReturn: result }) => {
        if (
          result.length === 1 &&
          result[0].client_id === String(createRecordClientId1) &&
          result[0].status === 'inserted'
        ) {
          return +result[0].server_id
        } else {
          throw new Error(`Unexpected response during create expence record: ${JSON.stringify(result)}`)
        }
      })
  }

  /**
   * Creates a single move operation (which represented in 2 records in drebedengi service)
   * @returns created records server IDs
   */
  createMove(params: CreateMoveParams): Promise<number[]> {
    return this.soapClient.setRecordList(createMoveParamsToSoap(params)).then(({ setRecordListReturn: result }) => {
      if (
        result.filter(
          x =>
            (x.client_id === String(createRecordClientId1) || x.client_id === String(createRecordClientId2)) &&
            x.status === 'inserted',
        ).length >= 2
      ) {
        return result.map(x => +x.server_id)
      } else {
        throw new Error(`Unexpected response during creating move operation: ${JSON.stringify(result)}`)
      }
    })
  }

  /**
   * Creates a single Exchange operation (which represented in 2 records in drebedengi service)
   * @returns created records server IDs
   */
  createExchange(params: CreateExchangeParams): Promise<[number, number]> {
    return this.soapClient.setRecordList(createExchangeParamsToSoap(params)).then(({ setRecordListReturn: result }) => {
      if (
        result.length === 2 &&
        result[0].client_id === String(createRecordClientId1) &&
        result[0].status === 'inserted' &&
        result[1].client_id === String(createRecordClientId2) &&
        result[1].status === 'inserted'
      ) {
        return [+result[0].server_id, +result[1].server_id] as [number, number]
      } else {
        throw new Error(`Unexpected response during creating Exchange operation: ${JSON.stringify(result)}`)
      }
    })
  }
}

function toBool(value: any): boolean {
  return value === 't' || value === 'true' || value === 'yes'
    ? true
    : value === 'f' || value === 'false' || value === 'no' ? false : Boolean(value)
}
