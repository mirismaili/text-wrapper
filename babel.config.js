/**
 * @author [S. Mahdi Mir-Ismaili](https://mirismaili.github.io)
 * Created on 1398/2/31 (2019/5/21).
 */
"use strict"

// Just for jest outms (outputs' module-system) tests! See: https://jestjs.io/docs/en/getting-started#using-babel
module.exports = {
	presets: [
		['@babel/preset-env', {targets: {node: 'current'}}],
	],
};
