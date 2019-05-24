/**
 * @author [S. Mahdi Mir-Ismaili](https://mirismaili.github.io)
 * Created on 1398/3/2 (2019/5/23).
 */
'use strict'

module.exports = require('babel-jest').createTransformer({
	presets: [
		["@babel/preset-flow", {"targets": {"node": "current"}}],
	]
})
