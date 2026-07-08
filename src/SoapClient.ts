import type { GetBalanceSoapParams, GetBalanceSoapResult } from './messages/getBalance'
import type {
  DeleteObjectSoapParams,
  DeleteObjectSoapResult,
  GetCategoryListSoapParams,
  GetCategoryListSoapResult,
  SetCategoryListSoapList,
  SetCategoryListSoapResult,
} from './messages/expenseCategories'
import type {
  GetCurrencyListSoapParams,
  GetCurrencyListSoapResult,
  SetCurrencyListSoapList,
  SetCurrencyListSoapResult,
} from './messages/currencies'
import type {
  GetSourceListSoapParams,
  GetSourceListSoapResult,
  SetSourceListSoapList,
  SetSourceListSoapResult,
} from './messages/incomeSources'
import type {
  GetPlaceListSoapParams,
  GetPlaceListSoapResult,
  SetPlaceListSoapList,
  SetPlaceListSoapResult,
} from './messages/getPlaceList'
import type { GetRecordListSoapParams, GetRecordListSoapResult } from './messages/getRecordList'
import type { SetRecordListSoapList, SetRecordListSoapResult } from './messages/setRecordList'
import { listToSoap, mapListToSoap, mapToSoap } from './paramsToSoap'
import type { AsyncDdngClient, AuthArgs } from './soapTypes'
import { xml2json } from './xml2json'

const { soap } = require('strong-soap')
const WSDL_URL = 'https://www.drebedengi.ru/soap/dd.wsdl'

/**
 * Low-level SOAP-client for drebedengi.ru service
 */
export class SoapClient {
  private readonly client: Promise<AsyncDdngClient>
  private readonly authArgs: AuthArgs

  constructor(apiId: string, login: string, pass: string) {
    this.client = createSoapClient()
    this.authArgs = { apiId, login, pass }
  }

  async deleteObject(params: DeleteObjectSoapParams): Promise<DeleteObjectSoapResult> {
    const client = await this.client

    try {
      return xml2json(await client.deleteObjectAsync({ ...this.authArgs, ...params }))
    } catch (error) {
      reportLastRequest(client, error)
    }
  }

  async getBalance(params?: GetBalanceSoapParams): Promise<GetBalanceSoapResult> {
    const client = await this.client

    try {
      return xml2json(await client.getBalanceAsync({ ...this.authArgs, params: mapToSoap(params) }))
    } catch (error) {
      reportLastRequest(client, error)
    }
  }

  async getCategoryList(params?: GetCategoryListSoapParams): Promise<GetCategoryListSoapResult> {
    const client = await this.client

    try {
      return xml2json(await client.getCategoryListAsync({ ...this.authArgs, idList: listToSoap(params?.idList) }))
    } catch (error) {
      reportLastRequest(client, error)
    }
  }

  async getCurrencyList(params?: GetCurrencyListSoapParams): Promise<GetCurrencyListSoapResult> {
    const client = await this.client

    try {
      return xml2json(await client.getCurrencyListAsync({ ...this.authArgs, idList: listToSoap(params?.idList) }))
    } catch (error) {
      reportLastRequest(client, error)
    }
  }

  async getSourceList(params?: GetSourceListSoapParams): Promise<GetSourceListSoapResult> {
    const client = await this.client

    try {
      return xml2json(await client.getSourceListAsync({ ...this.authArgs, idList: listToSoap(params?.idList) }))
    } catch (error) {
      reportLastRequest(client, error)
    }
  }

  async getRecordList(params?: GetRecordListSoapParams): Promise<GetRecordListSoapResult> {
    const client = await this.client

    try {
      return xml2json(await client.getRecordListAsync({ ...this.authArgs, params: mapToSoap(params) }))
    } catch (error) {
      reportLastRequest(client, error)
    }
  }

  async setCategoryList(list?: SetCategoryListSoapList): Promise<SetCategoryListSoapResult> {
    const client = await this.client

    try {
      return xml2json(await client.setCategoryListAsync({ ...this.authArgs, list: mapListToSoap(list) }))
    } catch (error) {
      reportLastRequest(client, error)
    }
  }

  async setCurrencyList(list?: SetCurrencyListSoapList): Promise<SetCurrencyListSoapResult> {
    const client = await this.client

    try {
      return xml2json(await client.setCurrencyListAsync({ ...this.authArgs, list: mapListToSoap(list) }))
    } catch (error) {
      reportLastRequest(client, error)
    }
  }

  async setSourceList(list?: SetSourceListSoapList): Promise<SetSourceListSoapResult> {
    const client = await this.client

    try {
      return xml2json(await client.setSourceListAsync({ ...this.authArgs, list: mapListToSoap(list) }))
    } catch (error) {
      reportLastRequest(client, error)
    }
  }

  async setRecordList(list?: SetRecordListSoapList): Promise<SetRecordListSoapResult> {
    const client = await this.client

    try {
      return xml2json(await client.setRecordListAsync({ ...this.authArgs, list: mapListToSoap(list) }))
    } catch (error) {
      reportLastRequest(client, error)
    }
  }

  async setPlaceList(list?: SetPlaceListSoapList): Promise<SetPlaceListSoapResult> {
    const client = await this.client

    try {
      return xml2json(await client.setPlaceListAsync({ ...this.authArgs, list: mapListToSoap(list) }))
    } catch (error) {
      reportLastRequest(client, error)
    }
  }

  async getPlaceList(params?: GetPlaceListSoapParams): Promise<GetPlaceListSoapResult> {
    const client = await this.client

    try {
      return xml2json(await client.getPlaceListAsync({ ...this.authArgs, idList: listToSoap(params?.idList) }))
    } catch (error) {
      reportLastRequest(client, error)
    }
  }
}

function createSoapClient(): Promise<AsyncDdngClient> {
  return new Promise((resolve, reject) => {
    soap.createClient(WSDL_URL, (error: unknown, rawClient: SoapMethodClient | undefined) => {
      if (error) {
        reject(error)
        return
      }

      if (!rawClient) {
        reject(new Error('strong-soap returned no client instance'))
        return
      }

      resolve({
        deleteObjectAsync: args => callSoapMethod<DeleteObjectSoapResult>(rawClient, 'deleteObject', args),
        getBalanceAsync: args => callSoapMethod<GetBalanceSoapResult>(rawClient, 'getBalance', args),
        getCategoryListAsync: args => callSoapMethod<GetCategoryListSoapResult>(rawClient, 'getCategoryList', args),
        getCurrencyListAsync: args => callSoapMethod<GetCurrencyListSoapResult>(rawClient, 'getCurrencyList', args),
        getPlaceListAsync: args => callSoapMethod<GetPlaceListSoapResult>(rawClient, 'getPlaceList', args),
        getRecordListAsync: args => callSoapMethod<GetRecordListSoapResult>(rawClient, 'getRecordList', args),
        getSourceListAsync: args => callSoapMethod<GetSourceListSoapResult>(rawClient, 'getSourceList', args),
        get lastRequest() {
          return rawClient.lastRequest
        },
        setCategoryListAsync: args => callSoapMethod<SetCategoryListSoapResult>(rawClient, 'setCategoryList', args),
        setCurrencyListAsync: args => callSoapMethod<SetCurrencyListSoapResult>(rawClient, 'setCurrencyList', args),
        setPlaceListAsync: args => callSoapMethod<SetPlaceListSoapResult>(rawClient, 'setPlaceList', args),
        setRecordListAsync: args => callSoapMethod<SetRecordListSoapResult>(rawClient, 'setRecordList', args),
        setSourceListAsync: args => callSoapMethod<SetSourceListSoapResult>(rawClient, 'setSourceList', args),
      })
    })
  })
}

function callSoapMethod<TResult>(
  client: SoapMethodClient,
  methodName: SoapMethodName,
  args: unknown,
): Promise<TResult> {
  const method = client[methodName] as SoapMethod<TResult>

  return new Promise((resolve, reject) => {
    method(args, (error: unknown, result?: TResult) => {
      if (error) {
        reject(error)
        return
      }

      if (result === undefined) {
        reject(new Error(`SOAP method ${methodName} returned no result`))
        return
      }

      resolve(result)
    })
  })
}

function reportLastRequest(client: AsyncDdngClient, error: unknown): never {
  console.error(`Error during SOAP request ${client.lastRequest ?? '<unknown request>'}`)
  throw error
}

type SoapMethodName =
  | 'deleteObject'
  | 'getBalance'
  | 'getCategoryList'
  | 'getCurrencyList'
  | 'getPlaceList'
  | 'getRecordList'
  | 'getSourceList'
  | 'setCategoryList'
  | 'setCurrencyList'
  | 'setPlaceList'
  | 'setRecordList'
  | 'setSourceList'

interface SoapMethodClient extends AsyncDdngClient {
  deleteObject(args: unknown, callback: SoapMethodCallback<DeleteObjectSoapResult>): void
  getBalance(args: unknown, callback: SoapMethodCallback<GetBalanceSoapResult>): void
  getCategoryList(args: unknown, callback: SoapMethodCallback<GetCategoryListSoapResult>): void
  getCurrencyList(args: unknown, callback: SoapMethodCallback<GetCurrencyListSoapResult>): void
  getPlaceList(args: unknown, callback: SoapMethodCallback<GetPlaceListSoapResult>): void
  getRecordList(args: unknown, callback: SoapMethodCallback<GetRecordListSoapResult>): void
  getSourceList(args: unknown, callback: SoapMethodCallback<GetSourceListSoapResult>): void
  setCategoryList(args: unknown, callback: SoapMethodCallback<SetCategoryListSoapResult>): void
  setCurrencyList(args: unknown, callback: SoapMethodCallback<SetCurrencyListSoapResult>): void
  setPlaceList(args: unknown, callback: SoapMethodCallback<SetPlaceListSoapResult>): void
  setRecordList(args: unknown, callback: SoapMethodCallback<SetRecordListSoapResult>): void
  setSourceList(args: unknown, callback: SoapMethodCallback<SetSourceListSoapResult>): void
}

type SoapMethod<TResult> = (args: unknown, callback: SoapMethodCallback<TResult>) => void
type SoapMethodCallback<TResult> = (error: unknown, result?: TResult) => void
