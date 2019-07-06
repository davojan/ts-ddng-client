import { GetRecordListResult, GetRecordListResultItem, RecordType } from './messages/getRecordList'
import { CreateRecordParams } from './messages/setRecordList'

export interface BaseOperation extends CreateRecordParams {
  operationType: RecordType
}

export type FinanceOperation = IncomeOperation | ExpenseOperation | MoveOperation | ExchangeOperation

// Income

export interface IncomeSpecificFields {
  sourceId: number
}

export interface IncomeOperation extends BaseOperation, IncomeSpecificFields {
  operationType: RecordType.Income
}

const incomeOperationFromRecord = ({
  placeId,
  sum,
  currencyId,
  dateTime,
  comment,
  budgetObjectId,
}: GetRecordListResultItem): IncomeOperation => ({
  placeId,
  sum,
  currencyId,
  dateTime,
  comment,
  operationType: RecordType.Income,
  sourceId: budgetObjectId,
})

export const isIncomeOperation = (operation: FinanceOperation): operation is IncomeOperation =>
  operation.operationType === RecordType.Income

// Expense

export interface ExpenseSpecificFields {
  categoryId: number
}

export interface ExpenseOperation extends BaseOperation, ExpenseSpecificFields {
  operationType: RecordType.Expense
}

const expenseOperationFromRecord = ({
  placeId,
  sum,
  currencyId,
  dateTime,
  comment,
  budgetObjectId,
}: GetRecordListResultItem): ExpenseOperation => ({
  placeId,
  sum,
  currencyId,
  dateTime,
  comment,
  operationType: RecordType.Expense,
  categoryId: budgetObjectId,
})

export const isExpenseOperation = (operation: FinanceOperation): operation is ExpenseOperation =>
  operation.operationType === RecordType.Expense

// Move

export interface MoveSpecificFields {
  fromPlaceId: number
}

export interface MoveOperation extends BaseOperation, MoveSpecificFields {
  operationType: RecordType.Move
}

function moveOperationFromRecords(record1: GetRecordListResultItem, record2: GetRecordListResultItem): MoveOperation {
  const fromRecord = record1.sum > 0 ? record2 : record1
  const toRecord = record1.sum > 0 ? record1 : record2
  return {
    fromPlaceId: fromRecord.placeId,
    placeId: toRecord.placeId,
    sum: toRecord.sum,
    currencyId: toRecord.currencyId,
    dateTime: toRecord.dateTime,
    comment: fromRecord.comment || toRecord.comment,
    operationType: RecordType.Move,
  }
}

export const isMoveOperation = (operation: FinanceOperation): operation is MoveOperation =>
  operation.operationType === RecordType.Move

// Exchange

export interface ExchangeSpecificFields {
  fromCurrencyId: number
  fromSum: number
}

export interface ExchangeOperation extends BaseOperation, ExchangeSpecificFields {
  operationType: RecordType.Exchange
}

function exchangeOperationFromRecords(
  record1: GetRecordListResultItem,
  record2: GetRecordListResultItem,
): ExchangeOperation {
  const fromRecord = record1.sum > 0 ? record2 : record1
  const toRecord = record1.sum > 0 ? record1 : record2
  return {
    placeId: toRecord.placeId,
    fromCurrencyId: fromRecord.currencyId,
    fromSum: fromRecord.sum,
    sum: toRecord.sum,
    currencyId: toRecord.currencyId,
    dateTime: toRecord.dateTime,
    comment: fromRecord.comment || toRecord.comment,
    operationType: RecordType.Exchange,
  }
}

export const isExchangeOperation = (operation: FinanceOperation): operation is ExchangeOperation =>
  operation.operationType === RecordType.Exchange

/**
 * Converts low-level record list into high-level finance operations.
 * Record is internal representation of the operations. Move and Exchange operations are represented as two records.
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
          const linkedRecordIdx = processingList.findIndex(x => x.id === record.linkedRecordId)
          if (linkedRecordIdx > -1) {
            // get and remove linked record from the source list to avoid duplicate processing
            const linkedRecord = processingList.splice(linkedRecordIdx, 1)[0]
            if (record.operationType === RecordType.Move) {
              result.push(moveOperationFromRecords(record, linkedRecord))
            } else {
              result.push(exchangeOperationFromRecords(record, linkedRecord))
            }
          } else {
            console.error('Linked record not found for move/exchange record:', record)
          }
          break
      }
    }
  }

  return result
}
