/**
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 * Created at 1398/3/1 (2019/5/22).
 */
'use strict'

const fs = require('fs-extra')
const TMP_DIR = require('./options.js').tmpDir

module.exports = async function () {
	// noinspection JSUnresolvedVariable
	const teardownStaticServerPromise = global.__STATIC_SERVER__.close()
	
	// noinspection JSUnresolvedVariable
	const teardownPuppeteerPromise = new Promise((resolve, reject) =>
			global.__BROWSER_GLOBAL__.close()
					.then(() => fs.remove(TMP_DIR), reject)
					.then(resolve, reject)
	)
	
	// noinspection JSCheckFunctionSignatures
	await Promise.all([
		teardownStaticServerPromise,
		teardownPuppeteerPromise,
	])
}
