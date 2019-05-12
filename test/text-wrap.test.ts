import * as fs from 'fs'
import {sha256} from 'js-sha256'
import TextWrapper from '../src/TextWrap'
//*********************************************************/

const input =
		fs.readFileSync('./test/input.txt', 'utf8').replace(/(?:\r\n|\r)/g, '\n')

const indents = ''
const maxLineLength = 120
const wrapResult = new TextWrapper({wrapOn: maxLineLength}).wrap(input, indents)
const output = wrapResult.wrappedText
//*********************************************************/

const joinedInput = input.replace(/\n/g, '')
const joinedOutput = output.replace(/\n/g, '')

//*********************************************************/
describe('General tests:', () => {
	it('Check output itself', () => expect(joinedOutput).toBe(joinedInput))
	
	it('Check num of markers', () => expect(wrapResult.markers.length).toBe(output.length - input.length))
	
	it('Try to find an illegal short line',
			// Two markers which [the distance between the first marker and the first breakable character after the second
			// marker] is less than or equal with [maxLineLength]
			() => {
				// noinspection JSUnusedAssignment
				let a = 0
				for (let b of wrapResult.markers) {
					const regexp = /[^\S\xA0]/g
					regexp.lastIndex = b
					
					const upBound = regexp.test(input) ? regexp.lastIndex - 1 : input.length
					const distance = upBound - a
					
					expect(distance).toBeGreaterThan(maxLineLength)
					
					a = b
				}
			}
	)
	
	it("Try to find an illegal long line in output", // A line that should to be wrapped, but didn't
			() => {
				const regExp = new RegExp(`^(?=.*[^\\S\\xA0\\n](?![^\\S\\xA0\\n]|$)).{${maxLineLength},}[\\S\\xA0]`,
						'gm')	// https://regex101.com/r/bdWnCx/2/
				
				expect(regExp.test(output)).toBeFalsy()
			})
	
	it('Check markers against output', () => {
		let anotherOutput = ''
		let a = 0
		for (const b of wrapResult.markers) {
			anotherOutput += input.slice(a, b) + '\n' + indents
			a = b
		}
		
		if (a > 0) anotherOutput += input.slice(a)
		else anotherOutput = input
		
		expect(anotherOutput).toBe(output)
	})
	//*********************************************************/
})

describe('Case-specific tests:', () => {
	it("Check input's hash", () =>
		expect(sha256(input)).toBe('fe1a8a1dc2891f6f9d8b60cf25a47386390b032a66e5046bc807184a66c90d67')
	)
	it("Check output's hash", () =>
		expect(sha256(output)).toBe('9c99d544df3d4b36b2f719d555551000e94f374ee3e8bd2fe0792f89de096f69')
	)
})
