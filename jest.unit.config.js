/**
 * @author [S. Mahdi Mir-Ismaili](https://mirismaili.github.io)
 * Created on 1398/2/14 (2019/5/4).
 */
"use strict";

module.exports = {
	transform: {
		".(ts|tsx)": "ts-jest"
	},
	testEnvironment: "node",
	testRegex: "\\.(test|spec)\\.(ts|tsx|js)$",
	coveragePathIgnorePatterns: [
		"/node_modules/",
		"/test/",
		"/dist/",
		"/src/utilities.ts",
	],
	coverageThreshold: {
		global: {
			"branches": 90,
			"functions": 95,
			"lines": 95,
			"statements": 95,
		}
	},
	collectCoverageFrom: [
		"src/*.{js,ts}",
	],
	coverageDirectory: 'coverage/unit',
}
