import { recordListToOperations } from './FinanceOperation'
import type { FinanceOperation } from './FinanceOperation'
import type { GetBalanceParams, GetBalanceResult } from './messages/getBalance'
import { getPlaceListParamsToSoap, placeListFromSoap } from './messages/getPlaceList'
import type { GetPlaceListParams, Place } from './messages/getPlaceList'
import type { GetRecordListParams, GetRecordListResult } from './messages/getRecordList'
import { FilterType, RecordType, getRecordListParamsToSoap, recordListFromSoap } from './messages/getRecordList'
import type {
  CreateExchangeParams,
  CreateExpenseParams,
  CreateIncomeParams,
  CreateMoveParams,
  SetRecordListSoapList,
} from './messages/setRecordList'
import {
  createExchangeParamsToSoap,
  createExpenseParamsToSoap,
  createIncomeParamsToSoap,
  createMoveParamsToSoap,
} from './messages/setRecordList'
import { SoapClient } from './SoapClient'
import { toBool } from './utils'

/**
 * High-level api client for drebedengi.ru service
 * Hides ugly SOAP API
 */
export class ApiClient {
  private readonly soapClient: SoapClient

  constructor(apiId: string, login: string, pass: string) {
    this.soapClient = new SoapClient(apiId, login, pass)
  }

  async getBalance(params: GetBalanceParams): Promise<GetBalanceResult> {
    const result = await this.soapClient.getBalance({
      restDate: params.atDate,
      is_with_accum: params.withoutAccumulations,
      is_with_duty: params.withoutDepts,
    })

    return result.getBalanceReturn.map(item => ({
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
    }))
  }

  /**
   * Requests plain records list filtered by the given params
   * Note: every move or exchange is represented as two records, not one.
   * To get higher-level operations see getOperations
   */
  async getRecordList(params: GetRecordListParams): Promise<GetRecordListResult> {
    const result = await this.soapClient.getRecordList(getRecordListParamsToSoap(params))
    return recordListFromSoap(result)
  }

  /**
   * Same as getRecordList but result is converted into high-level finance operations:
   *  incomes, expenses, moves and exchanges. Every operation represented as a single record with polimorphic type
   *  depending on the operation type.
   */
  async getOperations(params: GetRecordListParams): Promise<FinanceOperation[]> {
    const recordList = await this.getRecordList(params)
    return recordListToOperations(recordList)
  }

  /**
   * Creates a single income record
   * @returns created record server ID
   */
  async createIncome(params: CreateIncomeParams): Promise<number> {
    const { setRecordListReturn: result } = await this.soapClient.setRecordList([createIncomeParamsToSoap(params)])

    if (result.length === 1 && result[0].status === 'inserted') {
      return +result[0].server_id
    }

    throw new Error(`Unexpected response during create income record: ${JSON.stringify(result)}`)
  }

  /**
   * Creates a single expense record
   * @returns created record server ID
   */
  async createExpense(params: CreateExpenseParams): Promise<number> {
    const { setRecordListReturn: result } = await this.soapClient.setRecordList([createExpenseParamsToSoap(params)])

    if (result.length === 1 && result[0].status === 'inserted') {
      return +result[0].server_id
    }

    throw new Error(`Unexpected response during create expense record: ${JSON.stringify(result)}`)
  }

  /**
   * Creates a single move operation (which represented in 2 records in drebedengi service)
   * @returns created records server IDs
   */
  async createMove(params: CreateMoveParams): Promise<number[]> {
    const { setRecordListReturn: result } = await this.soapClient.setRecordList(createMoveParamsToSoap(params))

    if (result.filter(x => x.status === 'inserted').length >= 2) {
      return result.map(x => +x.server_id)
    }

    throw new Error(`Unexpected response during creating move operation: ${JSON.stringify(result)}`)
  }

  /**
   * Creates a single Exchange operation (which represented in 2 records in drebedengi service)
   * @returns created records server IDs
   */
  async createExchange(params: CreateExchangeParams): Promise<[number, number]> {
    const { setRecordListReturn: result } = await this.soapClient.setRecordList(createExchangeParamsToSoap(params))

    if (result.length === 2 && result[0].status === 'inserted' && result[1].status === 'inserted') {
      return [+result[0].server_id, +result[1].server_id] as [number, number]
    }

    throw new Error(`Unexpected response during creating Exchange operation: ${JSON.stringify(result)}`)
  }

  /**
   * Creates several finance operation is a single request
   * @returns list of server IDs of created records (multi-record operations' IDs are groupped)
   */
  async createOperations(operations: FinanceOperation[]): Promise<Array<number | [number, number]>> {
    const records: SetRecordListSoapList = []

    for (const operation of operations) {
      switch (operation.operationType) {
        case RecordType.Income:
          records.push(createIncomeParamsToSoap(operation))
          break
        case RecordType.Expense:
          records.push(createExpenseParamsToSoap(operation))
          break
        case RecordType.Move:
          records.push(...createMoveParamsToSoap(operation))
          break
        case RecordType.Exchange:
          records.push(...createExchangeParamsToSoap(operation))
      }
    }

    const { setRecordListReturn: result } = await this.soapClient.setRecordList(records)
    const serverIds: Array<number | [number, number]> = []

    if (records.length === result.length) {
      for (const operation of operations) {
        switch (operation.operationType) {
          case RecordType.Income:
          case RecordType.Expense: {
            const item = result.shift()
            if (item && item.status === 'inserted') {
              serverIds.push(+item.server_id)
            } else {
              throw Error(`Unexpected response during creating operations: ${JSON.stringify(result)}`)
            }
            break
          }
          case RecordType.Move:
          case RecordType.Exchange: {
            const item1 = result.shift()
            const item2 = result.shift()
            if (item1 && item2 && item1.status === 'inserted' && item2.status === 'inserted') {
              serverIds.push([+item1.server_id, +item2.server_id])
            } else {
              throw Error(`Unexpected response during creating operations: ${JSON.stringify(result)}`)
            }
          }
        }
      }
    }

    return serverIds
  }

  /**
   * Requests plain places list possibly filtered by ids
   */
  async getPlaces(params?: GetPlaceListParams): Promise<Place[]> {
    const result = await this.soapClient.getPlaceList(getPlaceListParamsToSoap(params))
    return placeListFromSoap(result)
  }
}

export { FilterType }
