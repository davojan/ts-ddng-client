import { soap } from 'strong-soap'
import { promisify } from 'bluebird'

import { GetRecordListSoapParams, GetRecordListSoapResult } from './messages/getRecordList'
import { SetRecordListSoapList, SetRecordListSoapResult } from './messages/setRecordList'
import { mapToSoap, mapListToSoap } from './paramsToSoap'
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
    const createClientAsync = promisify(soap.createClient)
    this.client = (createClientAsync as any)('https://www.drebedengi.ru/soap/dd.wsdl').then(client => {
      client.getBalanceAsync = promisify(client.getBalance)
      client.getRecordListAsync = promisify(client.getRecordList)
      client.setRecordListAsync = promisify(client.setRecordList)
      return client
    })
    this.authArgs = { apiId, login, pass }
  }

  getBalance(params?: types.GetBalanceParams): Promise<types.GetBalanceResult> {
    return this.client.then(
      client =>
        client
          .getBalanceAsync({ ...this.authArgs, params: mapToSoap(params) })
          .then(xml2json)
          .catch(err => {
            console.error(`Error during SOAP request ${(client as any).lastRequest}`)
            throw err
          }),
      // .then(res => {
      //   console.debug(`Previous SOAP request ${(client as any).lastRequest}`)
      //   return res
      // })
    )
  }

  getRecordList(params?: GetRecordListSoapParams): Promise<GetRecordListSoapResult> {
    return this.client.then(
      client =>
        client
          .getRecordListAsync({ ...this.authArgs, params: mapToSoap(params) })
          .then(xml2json)
          .catch(err => {
            console.error(`Error during SOAP request ${(client as any).lastRequest}`)
            throw err
          }),
      // .then(res => {
      //   console.debug(`Previous SOAP request ${(client as any).lastRequest}`)
      //   return res
      // })
    )
  }

  setRecordList(list?: SetRecordListSoapList): Promise<SetRecordListSoapResult> {
    return this.client.then(
      client =>
        client
          .setRecordListAsync({ ...this.authArgs, list: mapListToSoap(list) })
          .then(xml2json)
          .catch(err => {
            console.error(`Error during SOAP request ${(client as any).lastRequest}`)
            throw err
          }),
      // .then(res => {
      //   console.debug(`Previous SOAP request ${(client as any).lastRequest}`)
      //   return res
      // })
    )
  }
}
