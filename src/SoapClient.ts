import {createClientAsync} from 'soap'

import * as types from './soapTypes'
import { AsyncDdngClient, AuthArgs } from './soapTypes'
import { xml2json } from './xml2json'


/**
 * Low-level SOAP-client for drebedengi.ru service
 */
export class SoapClient {

  private client: Promise<AsyncDdngClient>
  private authArgs: AuthArgs

  constructor(apiId: string, login: string, pass: string) {
    this.client = createClientAsync('https://www.drebedengi.ru/soap/dd.wsdl')
    this.authArgs = {apiId, login, pass}
  }

  getBalance(params?: types.GetBalanceParams): Promise<types.GetBalanceResult> {
    return this.client.then(client => client.getBalanceAsync({...this.authArgs, params})).then(xml2json)
  }
}
