/**
 * @author [S. Mahdi Mir-Ismaili](https://mirismaili.github.io)
 * Created on 1398/2/31 (2019/5/21).
 */
"use strict"

import TextWrapper from '../dist/bundle.esm.js'
const TextWrapper1 = require('../dist/bundle.umd.js').default
const TextWrapper2 = require('../dist/main.umd.js').default

describe('Check module-system of final outputs to be worked as expected.', () => {
	it("bundle.esm", () => expect(new TextWrapper()).toBeInstanceOf(TextWrapper))
	
	it("bundle.umd", () => expect(new TextWrapper1()).toBeInstanceOf(TextWrapper1))
	
	it("main.umd", () => expect(new TextWrapper2()).toBeInstanceOf(TextWrapper2))
})

