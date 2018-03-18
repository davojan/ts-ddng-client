export interface GetBalanceSoapParams {
  restDate?: string
  is_with_accum?: boolean
  is_with_duty?: boolean
}

export interface GetBalanceSoapResult {
  getBalanceReturn: GetBalanceSoapResultItem[]
}

export interface GetBalanceSoapResultItem {
  sum: string
  currency_id: string
  place_id: string
  date: string
  is_for_duty: string
  is_credit_card: string
  description: string | null
  place_name: string
  currency_name: string
  currency_default: string
  parent_id: string
  sort: string
}

export interface GetBalanceParams {
  // date at which point the balances should be calculated
  atDate?: string

  // should accumulation places be excluded from the result (default false)
  withoutAccumulations?: boolean

  // should dept accounts (places) be excluded from the result (default false)
  withoutDepts?: boolean
}

export type GetBalanceResult = GetBalanceResultItem[]

export interface GetBalanceResultItem {
  placeId: number
  placeName: string
  isDeptAccount: boolean
  isCreditCard: boolean
  parentPlaceId: number | null

  sum: number
  currencyId: number
  currencyName: string
  isDefaultCurrency: boolean

  date: string
  description: string | null
  sortPosition: number
}
