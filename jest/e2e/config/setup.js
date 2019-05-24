/**
 * @author [S. Mahdi Mir-Ismaili](https://mirismaili.github.io)
 * Created on 1398/3/1 (2019/5/22).
 */
'use strict'

const fs = require('fs')
const path = require('path')
const url = require('url')
const http = require('http')

// noinspection NpmUsedModulesInstalled
const puppeteer = require('puppeteer') // Error: Cannot find module 'puppeteer' => See below note:

// Before run `test:e2e` you need to run `npm i -g puppeteer && npm link puppeteer` as a one-time-action.
// Why it's not in devDependencies?
// Regularly we install such packages locally (--save or --save-dev) but exceptionally I suggest installing `puppeteer`
// globally, because of its extra installation step: [node install.js ---> Downloading Chromium r662092 - 140.3 Mb] and
// because it just required for end-to-end tests.

const mkdirp = require('mkdirp')

const PORT = require('./options.js').listenPort
const TMP_DIR = require('./options.js').tmpDir

const staticServerPromise = new Promise((resolve, reject) => {
	const staticServer = http.createServer((req, res) => {
		// console.debug(req.method + ' ' + req.url);
		
		try {
			const uri = url.parse(req.url).pathname
			let filePath = path.join(process.cwd(), uri)
			
			e404:{
				if (!fs.existsSync(filePath)) break e404
				
				if (fs.statSync(filePath).isDirectory()) filePath = path.join(filePath, 'index.html')
				
				if (!fs.existsSync(filePath)) break e404
				
				const contentTypesByExtension = {
					'.html': 'text/html',
					'.css': 'text/css',
					'.js': 'text/javascript'
				}
				
				const data = fs.readFileSync(filePath, 'binary')
				
				const headers = {}
				const contentType = contentTypesByExtension[path.extname(filePath)]
				if (contentType) headers['Content-Type'] = contentType
				res.writeHead(200, headers)
				res.write(data, 'binary')
				res.end()
				
				return
			}
			//----------------------------------------------------------/e404:
			// noinspection UnreachableCodeJS
			console.error(`File not found: "${filePath}"`)
			res.writeHead(404, {'Content-Type': 'text/plain'})
			res.write('404/ Not Found\n')
			res.end()
		} catch (exeption) {
			console.error(e.stack)
			res.writeHead(500, {'Content-Type': 'text/plain'})
			res.write(e.toString())
			res.end()
		}
	})
	
	staticServer.on('error', reject)
	
	staticServer.listen(PORT, () => {
		// noinspection JSUndefinedPropertyAssignment
		global.__STATIC_SERVER__ = staticServer
		
		console.info(`Static file server running on: http://127.0.0.1:${PORT}`)
		resolve()
	})
})

const launchPuppeteerPromise = new Promise((resolve, reject) => {
	puppeteer.launch(
			// {
			// 	headless: false,
			// 	// slowMo: 500,
			// 	devtools: true,
			// }
	).then(browser => {
		// store the browser instance so we can teardown it later
		// this global is only available in the teardown but not in TestEnvironments
		// noinspection JSUndefinedPropertyAssignment
		global.__BROWSER_GLOBAL__ = browser
		
		// use the file system to expose the wsEndpoint for TestEnvironments
		mkdirp.sync(TMP_DIR)
		fs.writeFileSync(path.join(TMP_DIR, 'wsEndpoint'), browser.wsEndpoint())
	}, reject).then(resolve, reject)
})

// noinspection JSCheckFunctionSignatures
module.exports = async () => await Promise.all([staticServerPromise, launchPuppeteerPromise])

