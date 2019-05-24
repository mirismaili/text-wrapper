/**
 * @author [S. Mahdi Mir-Ismaili](https://mirismaili.github.io)
 * Created on 1398/3/3 (2019/5/24).
 */
'use strict'

// noinspection JSUnresolvedVariable
const TextWrapper = require('../../dist/main.umd.js').default

describe(`Node.js environment: "main.umd.js"`, () => {
	it("main.umd", () => expect(new TextWrapper()).toBeInstanceOf(TextWrapper))
})
