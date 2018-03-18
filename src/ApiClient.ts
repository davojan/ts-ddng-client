import { SoapClient } from '.'
import { GetBalanceParams, GetBalanceResult } from './messages/getBalance'
import {
  GetRecordListParams,
  getRecordListParamsToSoap,
  GetRecordListResult,
  recordListFromSoap,
} from './messages/getRecordList'
import {
  CreateExchangeParams,
  createExchangeParamsToSoap,
  CreateExpenceParams,
  createExpenceParamsToSoap,
  CreateIncomeParams,
  createIncomeParamsToSoap,
  CreateMoveParams,
  createMoveParamsToSoap,
  createRecordClientId1,
  createRecordClientId2,
} from './messages/setRecordList'
import { toBool } from './utils'

/**
 * High-level api client for drebedengi.ru service
 * Hides ugly SOAP API
 */
export class ApiClient {
  private soapClient: SoapClient

  constructor(apiId: string, login: string, pass: string) {
    this.soapClient = new SoapClient(apiId, login, pass)
  }

  getBalance(params: GetBalanceParams): Promise<GetBalanceResult> {
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
   * Request plain records list filtered by the given params
   * Note: every move or exchange is represented as two records, not one.
   * To get higher-level operations see getOperations
   * @param params
   */
  getRecordList(params: GetRecordListParams): Promise<GetRecordListResult> {
    return this.soapClient.getRecordList(getRecordListParamsToSoap(params)).then(recordListFromSoap)
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
