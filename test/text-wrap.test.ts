import * as fs from 'fs'
import {sha256} from 'js-sha256'
import TextWrapper from '../src/TextWrap'
//*********************************************************/

describe('Test `getVisualLength()`:', () => {
	it('Check `getVisualLength()`', () => {
		const obj = new TextWrapper()
		
		const a = 'Hello'
		const b = 'world!'
		
		// @ts-ignore
		expect(obj.getVisualLength(`\t${a} ${b}`)).toBe(4 + a.length + 1 + b.length)
		// @ts-ignore
		expect(obj.getVisualLength(`${a}\t${b}`, 4)).toBe(a.length + 3 + b.length)
		// @ts-ignore
		expect(obj.getVisualLength(`${a} \t${b}`, 9)).toBe(a.length + 1 + 1 + b.length)
		// @ts-ignore
		expect(obj.getVisualLength(`\t${a}\t${b}`, 8)).toBe(4 + a.length + 3 + b.length)
		// @ts-ignore
		expect(obj.getVisualLength(`\t${a}\t${b}\t`)).toBe(4 + a.length + 3 + b.length + 2)
		// @ts-ignore
		expect(obj.getVisualLength(`\t${a}\t${b}\t`, 1)).toBe(3 + a.length + 3 + b.length + 2)
		// @ts-ignore
		expect(obj.getVisualLength(`\t${a}\t${b}\t`, 2)).toBe(2 + a.length + 3 + b.length + 2)
		// @ts-ignore
		expect(obj.getVisualLength(`\t${a}\t${b}\t`, 3)).toBe(1 + a.length + 3 + b.length + 2)
		// @ts-ignore
		expect(obj.getVisualLength(`\t${a}\t${b}\t`, 4)).toBe(4 + a.length + 3 + b.length + 2)
		// @ts-ignore
		expect(obj.getVisualLength(`\t${a}\t${b}\t`, 11)).toBe(1 + a.length + 3 + b.length + 2)
		// @ts-ignore
		expect(obj.getVisualLength(`\t${a}\t${b}\t`, 12)).toBe(4 + a.length + 3 + b.length + 2)
		// @ts-ignore
		expect(obj.getVisualLength(`\t${a}\t${b}\t`, 13)).toBe(3 + a.length + 3 + b.length + 2)
		// @ts-ignore
		expect(obj.getVisualLength(`\t${a}\t${b}\t`, 14)).toBe(2 + a.length + 3 + b.length + 2)
	})
})
//*********************************************************/

const input =
		fs.readFileSync('./test/input.txt', 'utf8').replace(/(?:\r\n|\r)/g, '\n')

const indents = ''
const maxLineLength = 120
const textWrapper = new TextWrapper({wrapOn: maxLineLength})
const wrapResult = textWrapper.wrap(input, indents)
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
					// @ts-ignore
					const distance = textWrapper.getVisualLength(input.slice(a, upBound), 0)
					
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
			expect(sha256(input)).toBe('117677f3e12ded864c527d4f03583d4dd0be3cc0542c3cbbdbb01574dcf280c8')
	)
	it("Check output's hash", () =>
			expect(sha256(output)).toBe('96673830a9ed2cf2de55e9442dc17540b1ae0cf497d62c54d8268ec54352f23a')
	)
})
