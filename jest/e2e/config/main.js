/**
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 * Created at 1398/3/2 (2019/5/23).
 */
'use strict'

const path = require('path')
const parentPath = path.resolve(__dirname, '..').replace(/\\/g, '/')

module.exports = {
	rootDir: path.relative(__dirname, process.cwd()),
	moduleFileExtensions: ['js', 'flow'],
	testRegex: `${parentPath}/(?!config/|mock/).+?\\.js(\\.flow)?$`,
	globalSetup: `${__dirname}/setup.js`,
	globalTeardown: `${__dirname}/teardown.js`,
	testEnvironment: `${__dirname}/puppeteer_environment.js`,
	transform: {
		'.+\\.js\\.flow$': `${__dirname}/jestPreprocess.js`
	},
}
