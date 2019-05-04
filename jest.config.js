/**
 * @author [S. Mahdi Mir-Ismaili](https://mirismaili.github.io).
 * Created on 1398/2/14 (2019/5/4).
 */
"use strict";

module.exports = {
	transform: {
		".(ts|tsx)": "ts-jest"
	},
	testEnvironment: "node",
	testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
	moduleFileExtensions: [
		"ts",
		"tsx",
		"js",
	],
	coveragePathIgnorePatterns: [
		"/node_modules/",
		"/test/",
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
}
