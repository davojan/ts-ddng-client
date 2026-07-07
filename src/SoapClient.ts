import type { GetBalanceSoapParams, GetBalanceSoapResult } from './messages/getBalance'
import type { GetPlaceListSoapParams, GetPlaceListSoapResult } from './messages/getPlaceList'
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

  async getBalance(params?: GetBalanceSoapParams): Promise<GetBalanceSoapResult> {
    const client = await this.client

    try {
      return xml2json(await client.getBalanceAsync({ ...this.authArgs, params: mapToSoap(params) }))
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

  async setRecordList(list?: SetRecordListSoapList): Promise<SetRecordListSoapResult> {
    const client = await this.client

    try {
      return xml2json(await client.setRecordListAsync({ ...this.authArgs, list: mapListToSoap(list) }))
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
        getBalanceAsync: args => callSoapMethod<GetBalanceSoapResult>(rawClient, 'getBalance', args),
        getPlaceListAsync: args => callSoapMethod<GetPlaceListSoapResult>(rawClient, 'getPlaceList', args),
        getRecordListAsync: args => callSoapMethod<GetRecordListSoapResult>(rawClient, 'getRecordList', args),
        get lastRequest() {
          return rawClient.lastRequest
        },
        setRecordListAsync: args => callSoapMethod<SetRecordListSoapResult>(rawClient, 'setRecordList', args),
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

type SoapMethodName = 'getBalance' | 'getPlaceList' | 'getRecordList' | 'setRecordList'

interface SoapMethodClient extends AsyncDdngClient {
  getBalance(args: unknown, callback: SoapMethodCallback<GetBalanceSoapResult>): void
  getPlaceList(args: unknown, callback: SoapMethodCallback<GetPlaceListSoapResult>): void
  getRecordList(args: unknown, callback: SoapMethodCallback<GetRecordListSoapResult>): void
  setRecordList(args: unknown, callback: SoapMethodCallback<SetRecordListSoapResult>): void
}

type SoapMethod<TResult> = (args: unknown, callback: SoapMethodCallback<TResult>) => void
type SoapMethodCallback<TResult> = (error: unknown, result?: TResult) => void
