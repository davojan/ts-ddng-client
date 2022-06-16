import { promisify } from 'bluebird'

import { GetBalanceSoapParams, GetBalanceSoapResult } from './messages/getBalance'
import { GetPlaceListSoapParams, GetPlaceListSoapResult } from './messages/getPlaceList'
import { GetRecordListSoapParams, GetRecordListSoapResult } from './messages/getRecordList'
import { SetRecordListSoapList, SetRecordListSoapResult } from './messages/setRecordList'
import { listToSoap, mapListToSoap, mapToSoap } from './paramsToSoap'
import { AsyncDdngClient, AuthArgs } from './soapTypes'
import { xml2json } from './xml2json'

const { soap } = require('strong-soap') // tslint:disable-line

/**
 * Low-level SOAP-client for drebedengi.ru service
 */
export class SoapClient {
  private client: Promise<AsyncDdngClient>
  private authArgs: AuthArgs

  constructor(apiId: string, login: string, pass: string) {
    const createClientAsync = promisify(soap.createClient)
    this.client = (createClientAsync as any)('https://www.drebedengi.ru/soap/dd.wsdl').then((client: any) => {
      client.getBalanceAsync = promisify(client.getBalance)
      client.getCategoryListAsync = promisify(client.getCategoryList)
      client.getPlaceListAsync = promisify(client.getPlaceList)
      client.getCurrencyListAsync = promisify(client.getCurrencyList)
      client.getSourceListAsync = promisify(client.getSourceList)
      client.getRecordListAsync = promisify(client.getRecordList)
      client.setRecordListAsync = promisify(client.setRecordList)
      return client
    })
    this.authArgs = { apiId, login, pass }
  }

  getBalance(params?: GetBalanceSoapParams): Promise<GetBalanceSoapResult> {
    return this.client.then(client =>
      client
        .getBalanceAsync({ ...this.authArgs, params: mapToSoap(params) })
        .then(xml2json)
        .catch(err => {
          console.error(`Error during SOAP request ${(client as any).lastRequest}`)
          throw err
        }),
    )
  }

  getCategoryList() {
    return this.client.then(client =>
      client
        .getCategoryListAsync({ ...this.authArgs })
        .then(xml2json)
        .catch(err => {
          console.error(`Error during SOAP request ${(client as any).lastRequest}`)
          throw err
        }),
    )
  }

  getCurrencyList() {
    return this.client.then(client =>
      client
        .getCurrencyListAsync({ ...this.authArgs })
        .then(xml2json)
        .catch(err => {
          console.error(`Error during SOAP request ${(client as any).lastRequest}`)
          throw err
        }),
    )
  }

  getSourceList() {
    return this.client.then(client =>
      client
        .getSourceListAsync({ ...this.authArgs })
        .then(xml2json)
        .catch(err => {
          console.error(`Error during SOAP request ${(client as any).lastRequest}`)
          throw err
        }),
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
    return this.client.then(client =>
      client
        .setRecordListAsync({ ...this.authArgs, list: mapListToSoap(list) })
        .then(xml2json)
        .catch(err => {
          console.error(`Error during SOAP request ${(client as any).lastRequest}`)
          throw err
        }),
    )
  }

  getPlaceList(params?: GetPlaceListSoapParams): Promise<GetPlaceListSoapResult> {
    return this.client.then(
      client =>
        client
          .getPlaceListAsync({ ...this.authArgs, idList: listToSoap(params && params.idList) })
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
