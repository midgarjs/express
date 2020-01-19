[![Build Status](https://drone.midgar.io/api/badges/Midgar/express/status.svg)](https://drone.midgar.io/Midgar/express)
[![Coverage](https://sonar.midgar.io/api/project_badges/measure?project=midgar-express&metric=coverage)](https://sonar.midgar.io/dashboard?id=midgar-express)

# @midgar/express

Ajoute un service expess [Express](https://expressjs.com/)

## Installation

```sh
$ npm i @midgar/express
```

Si tout s'est bien passé, un message de confirmation s'affiche:
```sh
#midgar-cli
@midgar/express added to plugins.json !
```

## Fonctionnement
Ajoute un service **mid:express**:
```js
const expressService = mid.getService('mid:express')

// App express
const app = expressService.app
```

## Ajouter un middlware express
```js
import morgan from 'morgan'
import { Plugin } from '@midgar/midgar'

/**
 * TestPlugin
 */
class TestPlugin extends Plugin {
  init () {
    // Listen @midgar/express:afterInit event
    this.mid.on('@midgar/express:afterInit', (expressService) => {
      expressService.app.use(morgan('combined'))
    })
  }
}

export default TestPlugin
```


## Configuration
Ceci est la configuration par défault si elle n'est pas modifié dans la configration de Midgar.
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

Vous pouvez activer cors depuis cette même configuration:

```js
{
  ...
  express: {
    port: 3000,
    ...
    cors: {
      origin: 'https://domain.com',
      credentials: true,
      allowedHeaders: [
        'Access-Control-Allow-Headers', 
        'Origin',
        'Accept',
        ...
      ]
    }
  }
...
}

```
Vous trouverez plus d'information sur la configuration du module cors [ici](https://www.npmjs.com/package/cors).
