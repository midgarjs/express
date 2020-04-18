import { Plugin } from '@midgar/midgar'

/**
 * ExpressPlugin class
 * @class
 */
class ExpressPlugin extends Plugin {
  /**
   * Init plugin
   *
   * @return {Promise<void>}
   */
  async init () {
    // On Midgar stop stop http server
    this.mid.on('@midgar/midgar:stop', () => this.mid.getService('mid:express').stop())
    // Bind @midgar/service:afterLoad to start express
    this.mid.on('@midgar/service:afterInit', () => this.mid.getService('mid:express').initExpress())
  }
}

export default ExpressPlugin

export const dependencies = ['@midgar/service']
