[![Build Status](https://drone.midgar.io/api/badges/Midgar/express/status.svg)](https://drone.midgar.io/Midgar/express)
[![Coverage](https://sonar.midgar.io/api/project_badges/measure?project=Midgar%3Aexpress&metric=coverage)](https://sonar.midgar.io/dashboard?id=Midgar%3Aexpress)

# @midgar/express

Ajoute un service expess [Express](https://expressjs.com/)

## Installation

```sh
$ npm i @midgar/express --save
```

Si tout s'est bien passé, un message de confirmation s'affiche:
```sh
#midgar-cli
@midgar/express added to plugins.js !
```

## Fonctionnement
Ajoute un service **mid:express**:
```js
const expressService = mid.getService('mid:express')

// App express
const app = expressService.app

// Stop http server
expressService.stop()
// Start http server
expressService.start()
```

## Ajouter un middlware express
```js
import cookieParser from 'cookie-parser'
import { Plugin } from '@midgar/midgar'

/**
 * TestPlugin
 */
class TestPlugin extends Plugin {
  init () {
    // Listen @midgar/express:afterInit event
    this.mid.on('@midgar/express:afterInit', (expressService) => {
      expressService.app.use(cookieParser())
    })
  }
}

export default TestPlugin
```


## Configuration
Ceci est la configuration par défault si elle n'est pas modifié dans la configration de Midgar
```js
{
  ...
  express: {
    port: 3000,
    host: 'localhost',
    ssl: false,
    sslCert: '',
    sslKey: ''
  }
...
}

```