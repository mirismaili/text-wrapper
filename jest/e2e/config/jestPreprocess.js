/**
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 * Created at 1398/3/2 (2019/5/23).
 */
'use strict'

module.exports = require('babel-jest').createTransformer({
	presets: [
		["@babel/preset-flow", {"targets": {"node": "current"}}],
	]
})
