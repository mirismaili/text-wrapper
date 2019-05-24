import TextWrapper from '../../src/TextWrap'

/**
 * @author [S. Mahdi Mir-Ismaili](https://mirismaili.github.io)
 * Created on 1398/2/30 (2019/5/20).
 */

const obj = new TextWrapper()

describe('Test `getVisualLength()`:', () => {
	it('Check `getVisualLength()`', () => {
		const a = 'Hello'
		const b = 'world!'
		const m = a.length
		const n = b.length
		
		expect(obj.getVisualLength(`${a} ${b}`, 15)).toBe(m + 1 + n)
		
		expect(obj.getVisualLength(`\t${a} ${b}`)).toBe(4 + m + 1 + n)
		
		expect(obj.getVisualLength(`${a}\t${b}`, 4)).toBe(m + 3 + n)
		
		expect(obj.getVisualLength(`${a} \t${b}`, 9)).toBe(m + 1 + 1 + n)
		
		expect(obj.getVisualLength(`\t${a}\t\t${b}`, 8)).toBe(4 + m + 3 + 4 + n)
		
		expect(obj.getVisualLength(`\t\t${a}\t${b}\t`)).toBe(4 + 4 + m + 3 + n + 2)
		
		expect(obj.getVisualLength(`\t${a}\t${b}\t\t`, 1)).toBe(3 + m + 3 + n + 2 + 4)
		
		expect(obj.getVisualLength(`\t${a}\t${b}\t\t\t`, 2)).toBe(2 + m + 3 + n + 2 + 4 + 4)
		
		expect(obj.getVisualLength(`\t\t${a}\t\t${b}\t`, 3)).toBe(1 + 4 + m + 3 + 4 + n + 2)
		
		expect(obj.getVisualLength(`\t\t${a}\t${b}\t\t`, 4)).toBe(4 + 4 + m + 3 + n + 2 + 4)
		
		expect(obj.getVisualLength(`\t\t\t${a}\t${b}\t\t`, 11)).toBe(1 + 4 + 4 + m + 3 + n + 2 + 4)
		
		expect(obj.getVisualLength(`\t\t\t${a}\t\t${b}\t\t`, 12)).toBe(4 + 4 + 4 + m + 3 + 4 + n + 2 + 4)
		
		expect(obj.getVisualLength(`\t${a}\t\t\t\t${b}\t`, 13)).toBe(3 + m + 3 + 4 + 4 + 4 + n + 2)
		
		expect(obj.getVisualLength(`\t\t${a}\t\t${b}\t\t`, 14)).toBe(2 + 4 + m + 3 + 4 + n + 2 + 4)
	})
})
