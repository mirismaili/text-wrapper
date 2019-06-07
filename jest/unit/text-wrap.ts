import * as fs from 'fs'
import * as path from "path"
import {sha256} from 'js-sha256'
import TextWrap, {WrapStyle} from '../../src/TextWrap'

/**
 * @author [S. Mahdi Mir-Ismaili](https://mirismaili.github.io)
 * Created on 1398/2/13 (2019/5/3).
 */

const inputExpectedHash = '117677f3e12ded864c527d4f03583d4dd0be3cc0542c3cbbdbb01574dcf280c8'
const outputExpectedHash = '2e1bd0f9ae5b0ee9406908f58bd5b4030bbcdf464e5462e0fd1b142d49dbac2d'

const input = fs.readFileSync(path.resolve(__dirname, 'stub', 'input.txt'), 'utf8')
		.replace(/\r\n|\r/g, '\n')

const allOptions: (Options | undefined)[] = [
	undefined,
	{
		indents: '\t',
		wrapOn: 50,
		continuationIndent: '',
	},
	{
		indents: '',
		wrapOn: 51,
		continuationIndent: '\t',
	},
	{
		indents: '',
		wrapOn: 52,
		continuationIndent: '    ',
	},
]

const outputs: string[] = []

describe('Case-specific tests:', () => {
	it("Check input's hash", () => expect(sha256(input)).toBe(inputExpectedHash))
})

afterAll(() => {
	for (let i = 0; i < allOptions.length; ++i)
		fs.writeFile(outputPath(i), outputs[i], err => {if (err) console.error(err)})
})

for (let testNum = 0; testNum < allOptions.length; ++testNum) {
	const options = allOptions[testNum]
	const textWrap = new TextWrap(options)
	
	const maxLineLength = textWrap.wrapOn
	const continuationIndent = textWrap.continuationIndent
	const bc = textWrap.breakableCharactersClass
	const ec = textWrap.allowedExceedingCharactersClass
	
	const indents = options === undefined ? '' : options.indents
	const indentsN = indents + continuationIndent
	
	const wrapResult = textWrap.wrap(input, indents)
	const output = outputs[testNum] = wrapResult.wrappedText
	const markers = wrapResult.markers
	
	describe(`General tests [${testNum}]:`, () => {
		it('Check num of markers', () => expect(output.length).toBe(input.length + markers.length * ('\n' + indentsN).length))
		
		it('Reproduce output using markers', () => {
			let anotherOutput = ''
			let a = 0
			for (const b of markers) {
				anotherOutput += input.slice(a, b) + '\n' + indentsN
				a = b
			}
			
			if (a > 0) anotherOutput += input.slice(a)
			else anotherOutput = input
			
			expect(anotherOutput).toBe(output)
		})
		
		it('Try to find an illegal short line',
				// Two markers which [the distance between the first marker and the first breakable character after the second
				// marker] is less than or equal with [maxLineLength]
				() => {
					let a = 0
					const regExp = new RegExp(bc.source,
							bc.flags.appendIfNot('g'))
					
					for (let b of markers) {
						regExp.lastIndex = b
						
						const upBound = regExp.test(input) ? regExp.lastIndex : input.length
						const slice = indentsN + input.slice(a, upBound) // is not strict in first cycle of the loop that hasn't indentsN
						const distance = textWrap.getVisualLength(slice)
						
						expect(distance, `[${slice}]\n${regExp}`).toBeGreaterThan(maxLineLength)
						
						a = b
					}
				})
		
		it("Try to find an illegal long line", // A line that should to be wrapped, but hasn't
				() => {
					// https://regex101.com/r/4DaiXE/1/
					const regexp = new RegExp(`^([^\\n]*)(?:(?!\\n)${bc.source})[^\\n]*(?!${ec.source}).`,
							bc.flags.appendIfNot('g').appendIfNot('m'))
					
					while (true) {
						const match = regexp.exec(output)
						if (match === null) break
						
						const vLen = textWrap.getVisualLength(match[0])
						const wrongCondition = vLen > maxLineLength
						
						if (wrongCondition &&
								// Check to sure the line is breakable:
								textWrap.getVisualLength(match[1]) > textWrap.getVisualLength(indentsN)
						)
							expect(vLen, `[${match[0]}]\n${regexp}`).toBeLessThanOrEqual(maxLineLength)
					}
				})
		
		it("Try to find an illegal long line using RegExp", // Same as above but using RegExp. This one is not strict because can only calculate length, but not vLen (visual-length)
				() => {
					expect(output).not.toMatch1(
							// https://regex101.com/r/OfQoDb/1
							new RegExp(
									`^(?=.{${indentsN.length},}[^\\w\\xA0\\n](?![^\\S\\n]|$)).{${maxLineLength},}\\S`,
									'm'),
							`The text will be in ${outputPath(testNum)}`)
				})
	})
	
	describe(`Case-specific tests [${testNum}]:`, () => {
		it("Check output's hash", () => expect(sha256(output)).toBe(outputExpectedHash))
	})
}
//*************************************************************************************/

expect.extend({
	toMatch1(text: string, regExp: RegExp, msg: string | (() => string)) {
		const match1 = regExp.exec(text)
		const passed = match1 !== null
		
		const message = (toClause: () => string) =>
				() => `Expected the text to ${toClause()}\n${typeof msg === 'string' ? msg : msg()}`
		
		return passed ?
				{
					message: message(() => `doesn't match ${regExp}\nFirst match:\n[${match1}]`),
					pass: true,
				} :
				{
					message: message(() => `match ${regExp}`),
					pass: false,
				}
	},
})

String.prototype.appendIfNot = function (part: string): string {
	return this.indexOf(part) === -1 ? this as string + part : this as string
}

declare global {
	namespace jest {
		// noinspection JSUnusedGlobalSymbols
		interface Matchers<R> {
			toMatch1(regExp: RegExp, msg: string): R
		}
	}
	
	// noinspection JSUnusedGlobalSymbols
	interface String {
		appendIfNot(part: string): string;
	}
}

//*************************************************************************************/

interface Options extends WrapStyle {
	indents: string
}

function outputPath(i: number) {
	return path.resolve(__dirname, 'stub', `output (${i}).txt`)
}
