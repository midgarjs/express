import mocha from 'mocha'
import chai from 'chai'
import dirtyChai from 'dirty-chai'
import chaiHttp from 'chai-http'
import path from 'path'
import ExpressPlugin from '../src/index'
import expressService from '../src/services/express'

/**
 * @type {Midgar}
 */
import Midgar from '@midgar/midgar'

const ExpressService = expressService.service

// fix for TypeError: describe is not a function with mocha-teamcity-reporter
const { describe, it } = mocha

const expect = chai.expect
chai.use(dirtyChai)
chai.use(chaiHttp)

let mid = null
const initMidgar = async (suffix = null) => {
  mid = new Midgar()
  const configPath = 'fixtures/config' + (suffix !== null ? suffix : '')
  await mid.start(path.join(__dirname, configPath))
  return mid
}

/**
 * Test the service plugin
 */
describe('Service', function () {
  afterEach(async () => {
    await mid.stop()
    mid = null
  })

  /**
   * Test if the plugin id load
   */
  it('Plugin', async () => {
    mid = await initMidgar()
    // Test plugin instance
    const plugin = mid.pm.getPlugin('@midgar/express')
    expect(plugin).to.be.an.instanceof(ExpressPlugin, 'Plugin is not an instance of ExpressPlugin')

    // Test service instance
    expect(mid.getService('mid:express')).to.be.an.instanceof(ExpressService, 'mid:express service is not an instance of ExpressService')
  })

  /**
   * Add a route and test a request
   */
  it('HTTPS Serveur', async () => {
    mid = await initMidgar('-ssl')
    const app = mid.getService('mid:express').app

    // Add a get route to test express
    app.get('/getTest', function (req, res) {
      res.status(200).json({
        success: true
      })
    })

    // Do get request to test valid request
    let chaiRes = await chai.request(app).get('/getTest')

    // Test response
    expect(chaiRes).have.status(200)
    expect(chaiRes.body).be.a('object')
    expect(chaiRes.body.success).to.be.true()

    // Do get request to test error request
    chaiRes = await chai.request(app).get('/errorTest')
    // Test response
    expect(chaiRes).have.status(404)
  })
})
