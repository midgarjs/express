import { Plugin } from '@midgar/midgar'

/**
 * ExpressPlugin class
 * @class
 */
class ExpressPlugin extends Plugin {
  /**
   * Init plugin
   */
  async init () {
    // On Midgar stop stop http server
    this.mid.on('@midgar/midgar:stop', () => this.mid.getService('mid:express').stop())
  }
}

export default ExpressPlugin
