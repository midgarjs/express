
import express from 'express'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import http from 'http'
import https from 'https'

import { assignRecursive, timer } from '@midgar/utils'
const serviceName = 'mid:express'

/**
 * ExpressService class
 */
class ExpressService {
  constructor (mid) {
    /**
     * Midgar instance
     * @type {Midgar}
     */
    this.mid = mid

    /**
     * Express instance for the front webserver
     * @type {Express}
     * @see {@link http://expressjs.com/en/api.html|express doc}
     */
    this.app = null

    /**
     * Http server
     * @type {http.Server}
     */
    this.httpServer = null

    /**
     * Plugin config from Midgar config
     * @type {Object}
     */
    this.config = assignRecursive({
      host: 'localhost',
      port: 3000,
      ssl: false
    }, this.mid.config.express || {})

    if (!this.config.host || typeof this.config.host !== 'string') throw new TypeError('@midgar/express: Invalid express.host type in Midgar config !')
    if (!this.config.port || !Number.isInteger(this.config.port)) throw new TypeError('@midgar/express: Invalid express.host type in Midgar config !')

    // Check minimal config
    this.baseUrl = this._getBaseUrl()
  }

  /**
   * Int service
   */
  async init () {}

  /**
   * Int express
   */
  async initExpress () {
    // Disable epress for cli
    if (this.mid.cli) return
    // Init and start servers
    await this._initExpress()
    await this.start()
  }

  /**
   * Return base url from config params
   *
   * @return {String}
   */
  _getBaseUrl () {
    let baseUrl = (this.config.ssl ? 'https' : 'http') + '://' + this.config.host
    if (this.config.port !== 80 || (this.config.ssl && this.config.port !== 443)) baseUrl += ':' + this.config.port
    return baseUrl
  }

  /**
   * Create the express app and add some middlewares
   * @private
   */
  async _initExpress () {
    timer.start('midgar-express-init')
    this.mid.debug('@midgar/express: init')

    // express instance
    this.app = express()

    if (this.config.helmet === undefined || this.config.helmet) {
      // default options
      let helmetOptions = {}
      if (this.config.helmet !== undefined && this.config.helmet.constructor === ({}).constructor) {
        helmetOptions = this.config.helmet
      }
      this.app.use(helmet(helmetOptions))
    }

    if (this.config.jsonBodyParser === undefined || this.config.jsonBodyParser) {
      this.app.use(bodyParser.json()) // support json encoded bodies
    }

    if (this.config.urlencodedBodyParser === undefined || this.config.urlencodedBodyParser) {
      // default options
      let urlencodedOptions = { extended: true }
      if (this.config.urlencodedBodyParser !== undefined && this.config.urlencodedBodyParser.constructor === ({}).constructor) {
        urlencodedOptions = this.config.urlencodedBodyParser
      }
      this.app.use(bodyParser.urlencoded(urlencodedOptions)) // support encoded bodies
    }

    /**
     * afterInit event.
     * Used to attach middleware on express
     *
     * @event @midgar/express:afterInit
     */
    await this.mid.emit('@midgar/express:afterInit', this)

    // /!\ remove next arg cause res.status is not a function
    this.app.use((err, req, res, next) => {
      this.mid.error(err)
      this.mid.error('No route or error handler found !')
      res.status(500).send('Internal Server Error')
    })

    const time = timer.getTime('midgar-express-init')
    this.mid.debug(`@midgar/express: init in ${time} ms.`)
  }

  /**
   * Create http server instance and listen
   */
  async start () {
    // Check load stat
    if (this.config === null) throw new Error('@midgar/midgar: Load config before !')
    if (this.logger === null) throw new Error('@midgar/midgar: Init logger before !')

    try {
      if (!this.config.ssl) {
        this.httpServer = http.createServer(this.app)
        await this.httpServer.listen(this.config.port)
      } else {
        if (!this.config.sslKey) throw new Error('@midgar/express: express.sslKey config not found !')
        if (!this.config.sslCert) throw new Error('@midgar/express: express.sslCert config not found !')
        this.httpServer = https.createServer({
          key: this.config.sslKey,
          cert: this.config.sslCert
        }, this.app)

        await this.httpServer.listen(this.config.port, this.config.host)
      }

      this.mid.info(`Express ready: ${this.baseUrl}`)
    } catch (error) {
      this.mid.error('@midgar/Express: Cannot start the http server')
      this.mid.error(error)
    }
  }

  /**
   * Stop web server
   */
  async stop () {
    if (this.httpServer === null) {
      this.mid.warn('@midgar/express: Http server is not start !')
      return
    }

    await new Promise((resolve, reject) => {
      if (!this.httpServer) return resolve()
      try {
        this.httpServer.close(() => {
          this.httpServer = null
          resolve()
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}

export default {
  service: ExpressService,
  name: serviceName
}
