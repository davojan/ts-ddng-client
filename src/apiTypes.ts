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
