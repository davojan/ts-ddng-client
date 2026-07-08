import type { GetRecordListResult, GetRecordListResultItem } from './messages/getRecordList'
import { RecordType } from './messages/getRecordList'
import type { CreateRecordParams } from './messages/setRecordList'

export interface BaseOperationFields extends CreateRecordParams {
  operationType: RecordType
}

export interface BaseOperation extends BaseOperationFields {
  id: number
}

export type FinanceOperation = IncomeOperation | ExpenseOperation | MoveOperation | ExchangeOperation

export type CreateFinanceOperation =
  CreateIncomeOperation | CreateExpenseOperation | CreateMoveOperation | CreateExchangeOperation

export type UpdateFinanceOperation =
  UpdateIncomeOperation | UpdateExpenseOperation | UpdateMoveOperation | UpdateExchangeOperation

export class FinanceOperationValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FinanceOperationValidationError'
  }
}

export class FinanceOperationNotFoundError extends Error {
  constructor(readonly operationId: number) {
    super(`Finance operation ${operationId} does not exist`)
    this.name = 'FinanceOperationNotFoundError'
  }
}

export class FinanceOperationTypeMismatchError extends Error {
  constructor(
    readonly operationId: number,
    readonly expectedType: RecordType,
    readonly actualType: RecordType,
  ) {
    super(`Finance operation ${operationId} has type ${actualType}, expected ${expectedType}`)
    this.name = 'FinanceOperationTypeMismatchError'
  }
}

export class FinanceOperationDeleteError extends Error {
  constructor(
    readonly operationId: number,
    readonly originalError: unknown,
  ) {
    super(`Finance operation ${operationId} cannot be deleted`)
    this.name = 'FinanceOperationDeleteError'
  }
}

export interface IncomeSpecificFields {
  sourceId: number
}

export interface CreateIncomeOperation extends BaseOperationFields, IncomeSpecificFields {
  operationType: RecordType.Income
}

export interface IncomeOperation extends BaseOperation, IncomeSpecificFields {
  operationType: RecordType.Income
}

export type UpdateIncomeOperation = IncomeOperation

export interface ExpenseSpecificFields {
  categoryId: number
}

export interface CreateExpenseOperation extends BaseOperationFields, ExpenseSpecificFields {
  operationType: RecordType.Expense
}

export interface ExpenseOperation extends BaseOperation, ExpenseSpecificFields {
  operationType: RecordType.Expense
}

export type UpdateExpenseOperation = ExpenseOperation

export interface MoveSpecificFields {
  fromPlaceId: number
}

export interface CreateMoveOperation extends BaseOperationFields, MoveSpecificFields {
  operationType: RecordType.Move
}

export interface MoveOperation extends BaseOperation, MoveSpecificFields {
  operationType: RecordType.Move
}

export type UpdateMoveOperation = MoveOperation

export interface ExchangeSpecificFields {
  fromCurrencyId: number
  fromSum: number
}

export interface CreateExchangeOperation extends BaseOperationFields, ExchangeSpecificFields {
  operationType: RecordType.Exchange
}

export interface ExchangeOperation extends BaseOperation, ExchangeSpecificFields {
  operationType: RecordType.Exchange
}

export type UpdateExchangeOperation = ExchangeOperation

export const isIncomeOperation = (operation: FinanceOperation): operation is IncomeOperation =>
  operation.operationType === RecordType.Income

export const isExpenseOperation = (operation: FinanceOperation): operation is ExpenseOperation =>
  operation.operationType === RecordType.Expense

export const isMoveOperation = (operation: FinanceOperation): operation is MoveOperation =>
  operation.operationType === RecordType.Move

export const isExchangeOperation = (operation: FinanceOperation): operation is ExchangeOperation =>
  operation.operationType === RecordType.Exchange

export const incomeOperationFromRecord = ({
  id,
  placeId,
  sum,
  currencyId,
  dateTime,
  comment,
  budgetObjectId,
}: GetRecordListResultItem): IncomeOperation => ({
  id,
  placeId,
  sum: Math.abs(sum),
  currencyId,
  dateTime,
  comment,
  operationType: RecordType.Income,
  sourceId: budgetObjectId,
})

export const expenseOperationFromRecord = ({
  id,
  placeId,
  sum,
  currencyId,
  dateTime,
  comment,
  budgetObjectId,
}: GetRecordListResultItem): ExpenseOperation => ({
  id,
  placeId,
  sum: Math.abs(sum),
  currencyId,
  dateTime,
  comment,
  operationType: RecordType.Expense,
  categoryId: budgetObjectId,
})

export const moveOperationFromRecords = (
  record1: GetRecordListResultItem,
  record2: GetRecordListResultItem,
): MoveOperation => {
  const { fromRecord, toRecord } = splitLinkedRecords(record1, record2)

  return {
    id: toRecord.id,
    fromPlaceId: fromRecord.placeId,
    placeId: toRecord.placeId,
    sum: Math.abs(toRecord.sum),
    currencyId: toRecord.currencyId,
    dateTime: toRecord.dateTime,
    comment: fromRecord.comment || toRecord.comment,
    operationType: RecordType.Move,
  }
}

export const exchangeOperationFromRecords = (
  record1: GetRecordListResultItem,
  record2: GetRecordListResultItem,
): ExchangeOperation => {
  const { fromRecord, toRecord } = splitLinkedRecords(record1, record2)

  return {
    id: toRecord.id,
    placeId: toRecord.placeId,
    fromCurrencyId: fromRecord.currencyId,
    fromSum: Math.abs(fromRecord.sum),
    sum: Math.abs(toRecord.sum),
    currencyId: toRecord.currencyId,
    dateTime: toRecord.dateTime,
    comment: fromRecord.comment || toRecord.comment,
    operationType: RecordType.Exchange,
  }
}

/**
 * Converts low-level records into high-level finance operations.
 * Move and exchange operations are represented by two linked Drebedengi records.
 */
export function recordListToOperations(recordList: GetRecordListResult): FinanceOperation[] {
  const result: FinanceOperation[] = []
  const processingList = recordList.slice()

  while (processingList.length) {
    const record = processingList.shift()
    if (record) {
      switch (record.operationType) {
        case RecordType.Income:
          result.push(incomeOperationFromRecord(record))
          break
        case RecordType.Expense:
          result.push(expenseOperationFromRecord(record))
          break
        case RecordType.Move:
        case RecordType.Exchange:
          pushLinkedOperation(result, processingList, record)
          break
      }
    }
  }

  return result
}

function pushLinkedOperation(
  result: FinanceOperation[],
  processingList: GetRecordListResult,
  record: GetRecordListResultItem,
): void {
  const linkedRecordIdx = processingList.findIndex(x => x.id === record.linkedRecordId)

  if (linkedRecordIdx < 0) {
    console.error('Linked record not found for move/exchange record:', record)
    return
  }

  const linkedRecord = processingList.splice(linkedRecordIdx, 1)[0]

  if (record.operationType === RecordType.Move) {
    result.push(moveOperationFromRecords(record, linkedRecord))
  } else {
    result.push(exchangeOperationFromRecords(record, linkedRecord))
  }
}

function splitLinkedRecords(record1: GetRecordListResultItem, record2: GetRecordListResultItem) {
  return record1.sum > 0 ? { fromRecord: record2, toRecord: record1 } : { fromRecord: record1, toRecord: record2 }
}
