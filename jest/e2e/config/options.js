/**
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 * Created at 1398/3/3 (2019/5/24).
 */
'use strict'

const os = require('os')
const path = require('path')

module.exports.listenPort = 3000
module.exports.tmpDir = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')
