import * as fs from 'fs'
import {sha256} from 'js-sha256'
import * as path from "path"
import TextWrapper, {WrapOptions, wrapper, debug as textWrapperDebug} from '../../src/TextWrapper'

/**
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 * Created at 1398/2/13 (2019/5/3).
 */

let originalInput = fs.readFileSync(path.resolve(__dirname, 'stub', 'input.txt'), 'utf8')
		.replace(/\r\n?/g, '\n')

const allOptions: (Options | undefined)[] = [
	undefined,
	{
		indents: '\t',
		wrapOn: 50,
		continuationIndent: '',
		expectedOutputHash: 'f90cb72aaae81b846ad5af9d7c03947fb2e858fc7c847f2c54ff1c27fe13ea7e',
	},
	{
		indents: '',
		wrapOn: 51,
		continuationIndent: '\t',
		expectedOutputHash: '0d4bdbb897a39fb462f21e066cbc798266e3ee85e0adaa441a030d333ae306a4',
	},
	{
		indents: '',
		wrapOn: 52,
		continuationIndent: '    ',
		expectedOutputHash: '8ca6cdd09ab4e49adb7dc489c745015c26e242aa70f478373e4ddf5dbcf40329',
	},
	{
		indents: '\t',
		wrapOn: 53,
		continuationIndent: '\t\t',
		tabLength: 2,
		expectedOutputHash: 'e2af18c11ebc7a8c7b63b55ed953c0be30f38d7071f717725f6a30ff99e63b18',
	},
	{
		indents: '    ',
		wrapOn: 63,
		continuationIndent: '\t',
		tabLength: 8,
		expectedOutputHash: 'da196f9855194d5f90eaff99ecbd655bfa32b0bed918b6f8708dff6d20bfed37',
	},
	{
		indents: '\t    ',
		wrapOn: 73,
		continuationIndent: '\t  ',
		tabLength: 3,
		expectedOutputHash: 'c314c36352e0d0e27643a3100e94047df3af11efa8a1fbde90cb885a533fdfe6',
	},
	{
		indents: '\t',
		wrapOn: 74,
		continuationIndent: '   ',
		tabLength: 6,
		enabledDebugNamespace: '<@MODULE_NAME@>:BR',  // Just for cover `debug.formatters.c`
		expectedOutputHash: '337a9d26400205e184ec6ef841cee70714bb4f751be46f877e27016248a3f9b1',
	},
]

const outputs: string[] = []
//***********************************************************************************/

const expectedHashOfOutputWithDefOptions = '069a7cbd6b35f7649f7574a2346f33fbd715f34b4102ef4a3d4d82a4ab5dac92'

describe('Case-specific tests:', () => {
	it("Check input's hash", () =>
			expect(sha256(originalInput)).toBe('928c256346d0b16e69cd4c4ddd56e5608335f9ad16d1a25c26a9d8ff4b3e4edf')
	)
	
	it("Check `wrapper()` utility", () =>
			expect(sha256(wrapper(originalInput))).toBe(expectedHashOfOutputWithDefOptions)
	)
})

const testsNum = allOptions.length

afterAll(() => {
	for (let i = 0; i < testsNum; ++i)
		fs.writeFile(outputPath(i), outputs[i], err => {if (err) console.error(err)})
})

for (let testNum = 0; testNum < testsNum; ++testNum) {
	const options = allOptions[testNum]
	const textWrapper = new TextWrapper(options)
	const maxLineLength = textWrapper.wrapOn
	const continuationIndent = textWrapper.continuationIndent
	const bc = textWrapper.breakableCharacters
	const ec = textWrapper.allowedExceedingCharacters
	
	let alreadyIndents: string | undefined
	let expectedOutputHash: string
	
	let input = originalInput
	
	if (options === undefined) { // Default values for first options (that is undefined):
		alreadyIndents = undefined
		expectedOutputHash = '069a7cbd6b35f7649f7574a2346f33fbd715f34b4102ef4a3d4d82a4ab5dac92'
	} else {
		alreadyIndents = options.indents
		expectedOutputHash = options.expectedOutputHash
		
		if (options.enabledDebugNamespace) {  // Just for test coverage. To cover debug callback functions (formatters)
			textWrapperDebug.log = () => null  // Disable console outputs of `debug`
			textWrapperDebug.enable(options.enabledDebugNamespace)
			input = input.slice(0, 500)
		}
	}
	
	const wrapResult = textWrapper.wrap(input, alreadyIndents)
	
	if (alreadyIndents === undefined) alreadyIndents = ''
	const indentsN = alreadyIndents + continuationIndent
	
	const output = outputs[testNum] = wrapResult.wrappedText
	const markers = wrapResult.markers
	
	describe(`General tests [${testNum}]:`, () => {
		it('Check num of markers',
				() => expect(output.length).toBe(input.length + markers.length * ('\n' + indentsN).length))
		
		it('Reproduce output using markers', () => {
			let anotherOutput = ''
			let a = 0
			for (const b of markers) {
				anotherOutput += input.slice(a, b) + '\n' + indentsN
				a = b
			}
			
			anotherOutput += input.slice(a)
			
			expect(anotherOutput).toBe(output)
		})
		
		it('Try to find an illegal short line',
				// Two markers which [the distance between a marker and the first breakable character after next marker] is
				// less than or equal with [maxLineLength]
				() => {
					let a = 0
					const regExp = new RegExp(bc.source, bc.flags.appendIfNot('g'))
					
					for (let b of markers) {
						regExp.lastIndex = b
						
						const upBound = regExp.test(input) ? regExp.lastIndex : input.length
						const slice = indentsN + input.slice(a, upBound) // is not strict in first cycle of the loop that hasn't indentsN
						
						// WARNING: Due to performance issues, never expose `expect` method in a loop outside of an
						// `if` block (that checks test's condition).
						if (textWrapper.vLen(slice) <= maxLineLength)
							expect(textWrapper.vLen(slice)).toBeGreaterThan(maxLineLength, `[${slice}]\n${regExp}`)
						
						a = b
					}
				})
		
		it('Try to find an illegal long line', // A line that should to be wrapped, but hasn't
				() => {
					// https://regex101.com/r/4DaiXE/1/
					const regExp = new RegExp(`^([^\\n]*)(?:(?!\\n)${bc.source})[^\\n]*(?!${ec.source}).`,
							bc.flags.appendIfNot('g').appendIfNot('m'))
					
					while (true) {
						const match = regExp.exec(output)
						if (match === null) break
						
						const vLen = textWrapper.vLen(match[0])
						const wrongCondition = vLen > maxLineLength
						
						if (wrongCondition &&
								// Check to sure the line is breakable:
								textWrapper.vLen(match[1]) > textWrapper.vLen(indentsN)
						)
							expect(vLen).toBeLessThanOrEqual(maxLineLength, `[${match[0]}]\n${regExp}`)
					}
				})
		
		// it("Try to find an illegal long line using RegExp", // Same as above but using RegExp. This one is not strict and accurate because can only calculate length, but not vLen (visual-length)
		// 		() => {
		// 			expect(output).not.toMatch(
		// 					// https://regex101.com/r/OfQoDb/1
		// 					new RegExp(
		// 							`^(?=.{${indentsN.length},}[^\\w\\xA0\\n](?![^\\S\\n]|$)).{${maxLineLength},}\\S`,
		// 							'm'),
		// 					`The text will be in "${outputPath(testNum)}"`)
		// 		})
		
		it('Wrap wrapped!', () => expect(textWrapper.wrap(output, alreadyIndents).wrappedText).toBe(output))
	})
	
	describe(`Case-specific tests [${testNum}]:`, () => {
		it("Check output's hash", () => expect(sha256(output)).toBe(expectedOutputHash))
	})
}
//*************************************************************************************/

// noinspection JSUnusedGlobalSymbols
expect.extend({
	toBeGreaterThan(received: number, floor: number, msg: string | (() => string)) {
		return received > floor ?
				{
					message: () => `Expected: ${received} ≤ ${floor}\n${typeof msg === 'string' ? msg : msg()}`,
					pass: true,
				} :
				{
					message: () => `Expected: ${received} > ${floor}\n${typeof msg === 'string' ? msg : msg()}`,
					pass: false,
				}
	},
	toBeLessThanOrEqual(received: number, roof: number, msg: string | (() => string)) {
		return received <= roof ?
				{
					message: () => `Expected: ${received} > ${roof}\n${typeof msg === 'string' ? msg : msg()}`,
					pass: true,
				} :
				{
					message: () => `Expected: ${received} ≤ ${roof}\n${typeof msg === 'string' ? msg : msg()}`,
					pass: false,
				}
	},
	// toMatch(text: string, regExp: RegExp, msg: string | (() => string)) {
	// 	const match1 = regExp.exec(text)
	// 	const passed = match1 !== null
	//
	// 	const message = (toClause: () => string) =>
	// 			() => `Expected the text to ${toClause()}\n${typeof msg === 'string' ? msg : msg()}`
	//
	// 	return passed ?
	// 			{
	// 				message: message(() => `not match ${regExp}\nFirst match:\n[${match1}]`),
	// 				pass: true,
	// 			} :
	// 			{
	// 				message: message(() => `match ${regExp}`),
	// 				pass: false,
	// 			}
	// },
})

String.prototype.appendIfNot = function (part: string): string {
	return this.indexOf(part) === -1 ? this as string + part : this as string
}

declare global {
	namespace jest {
		// noinspection JSUnusedGlobalSymbols
		interface Matchers<R> {
			//toMatch(regExp: RegExp, msg: string | (() => string)): R
			toBeGreaterThan(floor: number, msg: string | (() => string)): R
			toBeLessThanOrEqual(roof: number, msg: string | (() => string)): R
		}
	}
	
	// noinspection JSUnusedGlobalSymbols
	interface String {
		appendIfNot(part: string): string;
	}
}

//*************************************************************************************/

interface Options extends WrapOptions {
	indents: string
	expectedOutputHash: string
	enabledDebugNamespace?: string
}

function outputPath(i: number) {
	return path.resolve(__dirname, 'stub', `output (${i}).txt`)
}
