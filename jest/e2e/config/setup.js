/**
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 * Created at 1398/3/1 (2019/5/22).
 */
'use strict'

const fs = require('fs')
const path = require('path')

const puppeteer = require('puppeteer')
const StaticServer = require('simplatic-http-server').default

const mkdirp = require('mkdirp')

const PORT = require('./options.js').listenPort
const TMP_DIR = require('./options.js').tmpDir

// noinspection JSUndefinedPropertyAssignment
global.staticServer = new StaticServer(PORT)

const launchPuppeteerPromise = new Promise((resolve, reject) => {
	puppeteer.launch(
			// {
			// 	headless: false,
			// 	// slowMo: 500,
			// 	devtools: true,
			// }
	).then(browser => {
		// noinspection JSUndefinedPropertyAssignment
		global.browser = browser
		
		// use the file system to expose the wsEndpoint for TestEnvironments
		mkdirp.sync(TMP_DIR)
		fs.writeFileSync(path.join(TMP_DIR, 'wsEndpoint'), browser.wsEndpoint())
		
		resolve()
	}, reject)
})

// noinspection JSCheckFunctionSignatures
module.exports = async () => await Promise.all([
	staticServer.listen(() => console.info(`Static server running at: http://127.0.0.1:${PORT}`)),
	launchPuppeteerPromise
])
