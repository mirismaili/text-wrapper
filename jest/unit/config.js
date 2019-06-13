/**
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 * Created at 1398/2/14 (2019/5/4).
 */
'use strict';

const path = require('path')

module.exports = {
	rootDir: path.relative(__dirname, process.cwd()),
	moduleFileExtensions: ['js', 'ts'],
	testEnvironment: 'node',
	transform: {
		'.(ts|tsx)': 'ts-jest'
	},
	testRegex: `${__dirname}/(?!config|disabled/|temp/).+?\\.[jt]s$`,
	coveragePathIgnorePatterns: [
		'/node_modules/',
		'/jest/',
		'/dist/',
		'/src/utilities.ts'
	],
	coverageThreshold: {
		global: {
			branches: 90,
			functions: 95,
			lines: 95,
			statements: 95
		}
	},
	collectCoverageFrom: [
		'src/*.{js,ts}'
	],
	coverageDirectory: 'coverage/unit',
}
