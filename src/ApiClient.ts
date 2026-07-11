import {
  FinanceOperationDeleteError,
  FinanceOperationNotFoundError,
  FinanceOperationTypeMismatchError,
  expenseOperationFromRecord,
  exchangeOperationFromRecords,
  incomeOperationFromRecord,
  moveOperationFromRecords,
  recordListToOperations,
} from './FinanceOperation'
import type {
  CreateFinanceOperation,
  ExpenseOperation,
  FinanceOperation,
  IncomeOperation,
  MoveOperation,
  ExchangeOperation,
} from './FinanceOperation'
import {
  ExpenseCategoryDeleteConflictError,
  createExpenseCategoryParamsToSoap,
  expenseCategoryListFromSoap,
  getExpenseCategoriesParamsToSoap,
  isExpenseCategoryDeleteConflict,
  updateExpenseCategoryParamsToSoap,
} from './messages/expenseCategories'
import type {
  CreateExpenseCategoryParams,
  ExpenseCategory,
  GetExpenseCategoriesParams,
  UpdateExpenseCategoryParams,
} from './messages/expenseCategories'
import type { GetBalanceParams, GetBalanceResult } from './messages/getBalance'
import {
  IncomeSourceDeleteConflictError,
  createIncomeSourceParamsToSoap,
  getIncomeSourcesParamsToSoap,
  incomeSourceListFromSoap,
  isIncomeSourceDeleteConflict,
  updateIncomeSourceParamsToSoap,
} from './messages/incomeSources'
import type {
  CreateIncomeSourceParams,
  GetIncomeSourcesParams,
  IncomeSource,
  UpdateIncomeSourceParams,
} from './messages/incomeSources'
import {
  CurrencyDeleteConflictError,
  createCurrencyParamsToSoap,
  currencyListFromSoap,
  getCurrenciesParamsToSoap,
  isCurrencyDeleteConflict,
  updateCurrencyParamsToSoap,
} from './messages/currencies'
import type { CreateCurrencyParams, Currency, GetCurrenciesParams, UpdateCurrencyParams } from './messages/currencies'
import {
  PlaceDeleteConflictError,
  createPlaceParamsToSoap,
  getPlacesParamsToSoap,
  isPlaceDeleteConflict,
  placeListFromSoap,
  updatePlaceParamsToSoap,
} from './messages/getPlaceList'
import type { CreatePlaceParams, GetPlacesParams, Place, UpdatePlaceParams } from './messages/getPlaceList'
import type { GetRecordListParams, GetRecordListResult } from './messages/getRecordList'
import {
  FilterType,
  PeriodType,
  RecordType,
  getRecordListParamsToSoap,
  recordListFromSoap,
} from './messages/getRecordList'
import type {
  CreateExchangeParams,
  CreateExpenseParams,
  CreateIncomeParams,
  CreateMoveParams,
  SetRecordListSoapList,
  UpdateExchangeParams,
  UpdateExpenseParams,
  UpdateIncomeParams,
  UpdateMoveParams,
} from './messages/setRecordList'
import {
  createExchangeParamsToSoap,
  createExpenseParamsToSoap,
  createIncomeParamsToSoap,
  createMoveParamsToSoap,
  updateExchangeParamsToSoap,
  updateExpenseParamsToSoap,
  updateIncomeParamsToSoap,
  updateMoveParamsToSoap,
} from './messages/setRecordList'
import { SoapClient } from './SoapClient'
import {
  TagDeleteConflictError,
  createTagParamsToSoap,
  getTagsParamsToSoap,
  isTagDeleteConflict,
  tagListFromSoap,
  updateTagParamsToSoap,
} from './messages/tags'
import type { CreateTagParams, GetTagsParams, Tag, UpdateTagParams } from './messages/tags'
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

  async getExpenseCategories(params?: GetExpenseCategoriesParams): Promise<ExpenseCategory[]> {
    const result = await this.soapClient.getCategoryList(getExpenseCategoriesParamsToSoap(params))
    return expenseCategoryListFromSoap(result)
  }

  async getExpenseCategoryById(id: number): Promise<ExpenseCategory | null> {
    const categories = await this.getExpenseCategories({ categoryIds: [id] })
    return categories[0] || null
  }

  async createExpenseCategory(params: CreateExpenseCategoryParams): Promise<number> {
    const { setCategoryListReturn: result } = await this.soapClient.setCategoryList([
      createExpenseCategoryParamsToSoap(params),
    ])

    if (result.length === 1 && result[0].status === 'inserted') {
      return +result[0].server_id
    }

    throw new Error(`Unexpected response during create expense category: ${JSON.stringify(result)}`)
  }

  async updateExpenseCategory(params: UpdateExpenseCategoryParams): Promise<void> {
    const { setCategoryListReturn: result } = await this.soapClient.setCategoryList([
      updateExpenseCategoryParamsToSoap(params),
    ])

    if (result.length === 1 && result[0].status === 'updated') {
      return
    }

    throw new Error(`Unexpected response during update expense category: ${JSON.stringify(result)}`)
  }

  async deleteExpenseCategory(id: number): Promise<void> {
    try {
      const result = await this.soapClient.deleteObject({ id, type: 'object' })
      if (+result.deleteObjectReturn === 1) {
        return
      }
    } catch (error) {
      if (isExpenseCategoryDeleteConflict(error)) {
        throw new ExpenseCategoryDeleteConflictError(id, error)
      }
      throw error
    }

    throw new ExpenseCategoryDeleteConflictError(id, new Error(`Unexpected delete response for category ${id}`))
  }

  async getIncomeSources(params?: GetIncomeSourcesParams): Promise<IncomeSource[]> {
    const result = await this.soapClient.getSourceList(getIncomeSourcesParamsToSoap(params))
    return incomeSourceListFromSoap(result)
  }

  async getIncomeSourceById(id: number): Promise<IncomeSource | null> {
    const sources = await this.getIncomeSources({ sourceIds: [id] })
    return sources[0] || null
  }

  async createIncomeSource(params: CreateIncomeSourceParams): Promise<number> {
    const { setSourceListReturn: result } = await this.soapClient.setSourceList([
      createIncomeSourceParamsToSoap(params),
    ])

    if (result.length === 1 && result[0].status === 'inserted') {
      return +result[0].server_id
    }

    throw new Error(`Unexpected response during create income source: ${JSON.stringify(result)}`)
  }

  async updateIncomeSource(params: UpdateIncomeSourceParams): Promise<void> {
    const { setSourceListReturn: result } = await this.soapClient.setSourceList([
      updateIncomeSourceParamsToSoap(params),
    ])

    if (result.length === 1 && result[0].status === 'updated') {
      return
    }

    throw new Error(`Unexpected response during update income source: ${JSON.stringify(result)}`)
  }

  async deleteIncomeSource(id: number): Promise<void> {
    try {
      const result = await this.soapClient.deleteObject({ id, type: 'object' })
      if (+result.deleteObjectReturn === 1) {
        return
      }
    } catch (error) {
      if (isIncomeSourceDeleteConflict(error)) {
        throw new IncomeSourceDeleteConflictError(id, error)
      }
      throw error
    }

    throw new IncomeSourceDeleteConflictError(id, new Error(`Unexpected delete response for income source ${id}`))
  }

  async getCurrencies(params?: GetCurrenciesParams): Promise<Currency[]> {
    const result = await this.soapClient.getCurrencyList(getCurrenciesParamsToSoap(params))
    return currencyListFromSoap(result)
  }

  async getCurrencyById(id: number): Promise<Currency | null> {
    const currencies = await this.getCurrencies({ currencyIds: [id] })
    return currencies[0] || null
  }

  async createCurrency(params: CreateCurrencyParams): Promise<number> {
    const createParams = createCurrencyParamsToSoap(params)
    const { setCurrencyListReturn: result } = await this.soapClient.setCurrencyList([createParams])
    const inserted = result.find(
      item => item.client_id === String(createParams.client_id) && item.status === 'inserted',
    )

    if (inserted) {
      return +inserted.server_id
    }

    throw new Error(`Unexpected response during create currency: ${JSON.stringify(result)}`)
  }

  async updateCurrency(params: UpdateCurrencyParams): Promise<void> {
    const { setCurrencyListReturn: result } = await this.soapClient.setCurrencyList([
      updateCurrencyParamsToSoap(params),
    ])
    const updated = result.find(item => +item.server_id === params.id && item.status === 'updated')

    if (updated) {
      return
    }

    throw new Error(`Unexpected response during update currency: ${JSON.stringify(result)}`)
  }

  async deleteCurrency(id: number): Promise<void> {
    try {
      const result = await this.soapClient.deleteObject({ id, type: 'currency' })
      if (+result.deleteObjectReturn === 1) {
        return
      }
    } catch (error) {
      if (isCurrencyDeleteConflict(error)) {
        throw new CurrencyDeleteConflictError(id, error)
      }
      throw error
    }

    throw new CurrencyDeleteConflictError(id, new Error(`Unexpected delete response for currency ${id}`))
  }

  async getPlaces(params?: GetPlacesParams): Promise<Place[]> {
    const result = await this.soapClient.getPlaceList(getPlacesParamsToSoap(params))
    return placeListFromSoap(result)
  }

  async getPlaceById(id: number): Promise<Place | null> {
    const places = await this.getPlaces({ placeIds: [id] })
    return places[0] || null
  }

  async createPlace(params: CreatePlaceParams): Promise<number> {
    const { setPlaceListReturn: result } = await this.soapClient.setPlaceList([createPlaceParamsToSoap(params)])

    if (result.length === 1 && result[0].status === 'inserted') {
      return +result[0].server_id
    }

    throw new Error(`Unexpected response during create place: ${JSON.stringify(result)}`)
  }

  async updatePlace(params: UpdatePlaceParams): Promise<void> {
    const place = await this.getPlaceById(params.id)

    if (!place) {
      throw new Error(`Place ${params.id} does not exist`)
    }

    const { setPlaceListReturn: result } = await this.soapClient.setPlaceList([
      updatePlaceParamsToSoap({ ...params, isForDuty: place.isForDuty }),
    ])

    if (result.length === 1 && result[0].status === 'updated') {
      return
    }

    throw new Error(`Unexpected response during update place: ${JSON.stringify(result)}`)
  }

  async deletePlace(id: number): Promise<void> {
    try {
      const result = await this.soapClient.deleteObject({ id, type: 'object' })
      if (+result.deleteObjectReturn === 1) {
        return
      }
    } catch (error) {
      if (isPlaceDeleteConflict(error)) {
        throw new PlaceDeleteConflictError(id, error)
      }
      throw error
    }

    throw new PlaceDeleteConflictError(id, new Error(`Unexpected delete response for place ${id}`))
  }

  async getTags(params?: GetTagsParams): Promise<Tag[]> {
    const result = await this.soapClient.getTagList(getTagsParamsToSoap(params))
    return tagListFromSoap(result)
  }

  async getTagById(id: number): Promise<Tag | null> {
    const tags = await this.getTags({ tagIds: [id] })
    return tags[0] || null
  }

  async createTag(params: CreateTagParams): Promise<number> {
    const createParams = createTagParamsToSoap(params)
    const { setTagListReturn: result } = await this.soapClient.setTagList([createParams])
    const inserted = result.find(item => item.client_id === String(createParams.client_id) && item.status === 'inserted')

    if (inserted) {
      return +inserted.server_id
    }

    throw new Error(`Unexpected response during create tag: ${JSON.stringify(result)}`)
  }

  async updateTag(params: UpdateTagParams): Promise<void> {
    const { setTagListReturn: result } = await this.soapClient.setTagList([updateTagParamsToSoap(params)])
    const updated = result.find(item => +item.server_id === params.id && item.status === 'updated')

    if (updated) {
      return
    }

    throw new Error(`Unexpected response during update tag: ${JSON.stringify(result)}`)
  }

  async deleteTag(id: number): Promise<void> {
    try {
      const result = await this.soapClient.deleteObject({ id, type: 'tag' })
      if (+result.deleteObjectReturn === 1) {
        return
      }
    } catch (error) {
      if (isTagDeleteConflict(error)) {
        throw new TagDeleteConflictError(id, error)
      }
      throw error
    }

    throw new TagDeleteConflictError(id, new Error(`Unexpected delete response for tag ${id}`))
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

  async getExpenses(params: GetRecordListParams = {}): Promise<ExpenseOperation[]> {
    return (await this.getRecordList({ ...params, recordType: RecordType.Expense })).map(expenseOperationFromRecord)
  }

  async getExpenseById(id: number): Promise<ExpenseOperation | null> {
    const record = await this.getOperationRecordById(id)
    return record?.operationType === RecordType.Expense ? expenseOperationFromRecord(record) : null
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

  async updateIncome(params: UpdateIncomeParams): Promise<void> {
    await this.requireOperationRecord(params.id, RecordType.Income)

    const { setRecordListReturn: result } = await this.soapClient.setRecordList([updateIncomeParamsToSoap(params)])

    if (result.length === 1 && result[0].status === 'updated') {
      return
    }

    throw new Error(`Unexpected response during update income record: ${JSON.stringify(result)}`)
  }

  async deleteIncome(id: number): Promise<void> {
    await this.deleteOperation(id, RecordType.Income, 'income')
  }

  async getIncomes(params: GetRecordListParams = {}): Promise<IncomeOperation[]> {
    return (await this.getRecordList({ ...params, recordType: RecordType.Income })).map(incomeOperationFromRecord)
  }

  async getIncomeById(id: number): Promise<IncomeOperation | null> {
    const record = await this.getOperationRecordById(id)
    return record?.operationType === RecordType.Income ? incomeOperationFromRecord(record) : null
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

  async updateExpense(params: UpdateExpenseParams): Promise<void> {
    await this.requireOperationRecord(params.id, RecordType.Expense)

    const { setRecordListReturn: result } = await this.soapClient.setRecordList([updateExpenseParamsToSoap(params)])

    if (result.length === 1 && result[0].status === 'updated') {
      return
    }

    throw new Error(`Unexpected response during update expense record: ${JSON.stringify(result)}`)
  }

  async deleteExpense(id: number): Promise<void> {
    await this.deleteOperation(id, RecordType.Expense, 'waste')
  }

  /**
   * Creates a single move operation (which represented in 2 records in drebedengi service)
   * @returns created operation ID
   */
  async createMove(params: CreateMoveParams): Promise<number> {
    const { setRecordListReturn: result } = await this.soapClient.setRecordList(createMoveParamsToSoap(params))

    if (result.length === 2 && result[0].status === 'inserted' && result[1].status === 'inserted') {
      return +result[0].server_id
    }

    throw new Error(`Unexpected response during creating move operation: ${JSON.stringify(result)}`)
  }

  async updateMove(params: UpdateMoveParams): Promise<void> {
    const [record, linkedRecord] = await this.requireLinkedOperationRecords(params.id, RecordType.Move)
    const { setRecordListReturn: result } = await this.soapClient.setRecordList(
      updateMoveParamsToSoap({
        ...params,
        id: record.sum > 0 ? record.id : linkedRecord.id,
        linkedRecordId: record.sum > 0 ? linkedRecord.id : record.id,
      }),
    )

    if (result.length === 2 && result.every(x => x.status === 'updated')) {
      return
    }

    throw new Error(`Unexpected response during update move operation: ${JSON.stringify(result)}`)
  }

  async deleteMove(id: number): Promise<void> {
    await this.deleteOperation(id, RecordType.Move, 'move')
  }

  async getMoves(params: GetRecordListParams = {}): Promise<MoveOperation[]> {
    return recordListToOperations(await this.getRecordList({ ...params, recordType: RecordType.Move })).filter(
      operation => operation.operationType === RecordType.Move,
    )
  }

  async getMoveById(id: number): Promise<MoveOperation | null> {
    const records = await this.getLinkedOperationRecordsById(id)
    return records && records[0].operationType === RecordType.Move
      ? moveOperationFromRecords(records[0], records[1])
      : null
  }

  /**
   * Creates a single Exchange operation (which represented in 2 records in drebedengi service)
   * @returns created operation ID
   */
  async createExchange(params: CreateExchangeParams): Promise<number> {
    const { setRecordListReturn: result } = await this.soapClient.setRecordList(createExchangeParamsToSoap(params))

    if (result.length === 2 && result[0].status === 'inserted' && result[1].status === 'inserted') {
      return +result[0].server_id
    }

    throw new Error(`Unexpected response during creating Exchange operation: ${JSON.stringify(result)}`)
  }

  async updateExchange(params: UpdateExchangeParams): Promise<void> {
    const [record, linkedRecord] = await this.requireLinkedOperationRecords(params.id, RecordType.Exchange)
    const { setRecordListReturn: result } = await this.soapClient.setRecordList(
      updateExchangeParamsToSoap({
        ...params,
        id: record.sum > 0 ? record.id : linkedRecord.id,
        linkedRecordId: record.sum > 0 ? linkedRecord.id : record.id,
      }),
    )

    if (result.length === 2 && result.every(x => x.status === 'updated')) {
      return
    }

    throw new Error(`Unexpected response during update exchange operation: ${JSON.stringify(result)}`)
  }

  async deleteExchange(id: number): Promise<void> {
    await this.deleteOperation(id, RecordType.Exchange, 'change')
  }

  async getExchanges(params: GetRecordListParams = {}): Promise<ExchangeOperation[]> {
    return recordListToOperations(await this.getRecordList({ ...params, recordType: RecordType.Exchange })).filter(
      operation => operation.operationType === RecordType.Exchange,
    )
  }

  async getExchangeById(id: number): Promise<ExchangeOperation | null> {
    const records = await this.getLinkedOperationRecordsById(id)
    return records && records[0].operationType === RecordType.Exchange
      ? exchangeOperationFromRecords(records[0], records[1])
      : null
  }

  /**
   * Creates several finance operation is a single request
   * @returns list of server IDs of created records (multi-record operations' IDs are groupped)
   */
  async createOperations(operations: CreateFinanceOperation[]): Promise<number[]> {
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
    const serverIds: number[] = []

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
              serverIds.push(+item1.server_id)
            } else {
              throw Error(`Unexpected response during creating operations: ${JSON.stringify(result)}`)
            }
          }
        }
      }
    }

    return serverIds
  }

  private async getOperationRecordById(id: number): Promise<GetRecordListResult[number] | null> {
    const recentRecord = (await this.getRecentOperationRecords()).find(item => item.id === id)

    if (recentRecord) {
      return recentRecord
    }

    return (await this.getAllOperationRecords()).find(item => item.id === id) || null
  }

  private async getLinkedOperationRecordsById(
    id: number,
  ): Promise<[GetRecordListResult[number], GetRecordListResult[number]] | null> {
    const recentRecords = await this.getRecentOperationRecords()
    const recentPair = findLinkedOperationRecords(recentRecords, id)

    if (recentPair) {
      return recentPair
    }

    return findLinkedOperationRecords(await this.getAllOperationRecords(), id)
  }

  private async getRecentOperationRecords(): Promise<GetRecordListResult> {
    return this.getRecordList({ periodType: PeriodType.Last20Records })
  }

  private async getAllOperationRecords(): Promise<GetRecordListResult> {
    return this.getRecordList({ periodType: PeriodType.AllTime })
  }

  private async requireOperationRecord(id: number, expectedType: RecordType): Promise<GetRecordListResult[number]> {
    const record = await this.getOperationRecordById(id)

    if (!record) {
      throw new FinanceOperationNotFoundError(id)
    }

    if (record.operationType !== expectedType) {
      throw new FinanceOperationTypeMismatchError(id, expectedType, record.operationType)
    }

    return record
  }

  private async requireLinkedOperationRecords(
    id: number,
    expectedType: RecordType,
  ): Promise<[GetRecordListResult[number], GetRecordListResult[number]]> {
    const records = await this.getLinkedOperationRecordsById(id)

    if (!records) {
      throw new FinanceOperationNotFoundError(id)
    }

    if (records[0].operationType !== expectedType) {
      throw new FinanceOperationTypeMismatchError(id, expectedType, records[0].operationType)
    }

    if (records[1].operationType !== expectedType) {
      throw new FinanceOperationTypeMismatchError(records[1].id, expectedType, records[1].operationType)
    }

    return records
  }

  private async deleteOperation(
    id: number,
    expectedType: RecordType,
    deleteType: 'change' | 'income' | 'move' | 'waste',
  ): Promise<void> {
    await this.requireOperationRecord(id, expectedType)

    try {
      const result = await this.soapClient.deleteObject({ id, type: deleteType })
      if (+result.deleteObjectReturn === 1) {
        return
      }
    } catch (error) {
      throw new FinanceOperationDeleteError(id, error)
    }

    throw new FinanceOperationDeleteError(id, new Error(`Unexpected delete response for operation ${id}`))
  }
}

export { FilterType }

function findLinkedOperationRecords(
  records: GetRecordListResult,
  id: number,
): [GetRecordListResult[number], GetRecordListResult[number]] | null {
  const record = records.find(item => item.id === id)

  if (!record) {
    return null
  }

  if (!record.linkedRecordId) {
    throw new Error(`Finance operation ${id} has no linked record`)
  }

  const linkedRecord = records.find(item => item.id === record.linkedRecordId)

  if (!linkedRecord) {
    throw new Error(`Linked finance operation record ${record.linkedRecordId} does not exist`)
  }

  return [record, linkedRecord]
}
