# ts-ddng-client (TypeScript/TypeSafe Drebedengi Client)

[![Greenkeeper badge](https://badges.greenkeeper.io/davojan/ts-ddng-client.svg)](https://greenkeeper.io/)

[![Build Status](https://img.shields.io/travis/davojan/ts-ddng-client/master.svg)](https://travis-ci.org/davojan/ts-ddng-client)
[![Coverage Status](https://img.shields.io/coveralls/davojan/ts-ddng-client/master.svg)](https://coveralls.io/github/davojan/ts-ddng-client?branch=master)
[![Dependency Status](https://img.shields.io/david/davojan/ts-ddng-client.svg)](https://david-dm.org/davojan/ts-ddng-client)
[![devDependency Status](https://img.shields.io/david/dev/davojan/ts-ddng-client.svg)](https://david-dm.org/davojan/ts-ddng-client?type=dev)

Javascript/typescript client library to conveniently work with API of [drebedengi.ru](https://drebedengi.ru) personal
finance service.

Aimed to help in automation of personal finance routine and integration tasks.

> WARNING: this is still early alfa. Almost everything is subject to change!


## Features (planned)

* Clear intuitive API (SOAP API provided by the drebedengi is very low-level and not developer-friendly).
* Written in typescript. All typings available.
* Works on node, browser and react-native.
* Promise-powered, async-await capable.


## Usage

```shell
npm install --save ts-ddng-client
# or
yarn add ts-ddng-client
```

```typescript
import { ApiClient } from 'ts-ddng-client'

const client = new ApiClient('demo_api', 'demo@example.com', 'demo')

client.getBalance().then(balances => {
  console.log('current balances', balances)
})

client.createIncome({
  placeId: 40034,
  sourceId: 40036,
  sum: 20000,
  dateTime: '2010-12-14 13:58:00',
  comment: 'xxx',
  currencyId: 17,
}).then(serverId => {
  console.log('Income operation created, server record ID:', serverId)
})
```

## API Docs

There are not any yet :( But you can examine ``test/apiClient.ts`` to get the idea.
