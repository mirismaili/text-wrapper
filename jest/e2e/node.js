/**
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 * Created at 1398/3/3 (2019/5/24).
 */
'use strict'

// noinspection JSUnresolvedVariable
const text_wrapper_lib = require('../../dist/main.umd.js')

const TextWrapper = text_wrapper_lib.default
const DEF_WRAP_STYLE = text_wrapper_lib.DEF_WRAP_STYLE

describe(`Node.js environment: "main.umd.js"`, () => {
	it("main.umd", () => expect(new TextWrapper()).toBeInstanceOf(TextWrapper))
})
