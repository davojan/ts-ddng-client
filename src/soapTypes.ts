export interface AsyncDdngClient {
  getBalanceAsync: (args: AuthArgs & { params?: GetBalanceParams }) => Promise<GetBalanceResult>
}

export interface AuthArgs {
  apiId: string
  login: string
  pass: string
}

export interface GetBalanceParams {
  restDate?: string
  is_with_accum?: boolean
  is_with_duty?: boolean
}

export type GetBalanceResult = any
