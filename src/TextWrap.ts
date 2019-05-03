import {initiateObject} from "./utilities";

/**
 * @author [S. Mahdi Mir-Ismaili](https://mirismaili.github.io).
 * Created on 1398/2/6 (2019/4/26).
 */
export default class TextWrap implements WrapStyle {
	// tslint:disable-next-line:variable-name
	private readonly tabLength_1: number
	private readonly continuationIndentVLength: number
	
	readonly continuationIndent!: string
	readonly tabLength!: number
	readonly wrapOn!: number
	
	constructor(wrapStyle: WrapStyle = DEF_WRAP_STYLE) {
		initiateObject(this, wrapStyle, DEF_WRAP_STYLE)
		this.tabLength_1 = this.tabLength - 1
		
		this.continuationIndentVLength = this.getVisualLength(this.continuationIndent)
	}
	
	wrap(text: string, indents: string): WrapResult {
		const markers: number[] = []
		const tabLength = this.tabLength
		const length = text.length
		const indentsN = indents + this.continuationIndent
		const indentsNVLen = this.getVisualLength(indentsN)
		
		let from = 0
		let wrappedText = ''
		
		mainLoop: for (
				let i = 0, vLen = 0, vLen0 = 0, start = 0, marker = 0, c: string, fastCheck = false;
				i < length;
				++i
		) {
			c = text[i]
			vLen += c === '\t' ? tabLength : 1
			// console.debug(`A: ${c} / ${vLen}`);
			
			searchBreakLine: do {
				if (c === '\n') break searchBreakLine
				
				const isNotBreakable = /^[\S\x0A]$/.test(c) // [\S\x0A]: All non-breakable characters ('\n' already filtered)
				
				searchWhiteSpace: do {
					if (vLen > this.wrapOn) // tslint:disable-next-line:no-conditional-assignment
						if (fastCheck || ((fastCheck = true) &&
								// The 2nd condition will always be true if the 1st is true. Actually, it is the main condition
								// we need to check, but we know in most cases (more than 95%) the 1st is true.
								(marker - start > indentsNVLen ||
										this.getVisualLength(text.slice(start, marker)) > indentsNVLen))
						) {
							if (isNotBreakable) break searchWhiteSpace
						} else {
							if (isNotBreakable) continue mainLoop
							
							fastCheck = false
						}
					else if (isNotBreakable)
						continue mainLoop
					
					// Any breakable character (white-space except '\n' and '\xA0'):
					
					marker = i + 1 // Store the value of i
					vLen0 = vLen // Store the value of vLen
					continue mainLoop
				} while (false) // /searchWhiteSpace
				
				markers.push(marker)
				wrappedText += text.slice(from, marker) + '\n' + indentsN
				// console.debug(`L: [${from}, ${marker}) - ${vLen} - ${indentsNVLen + (vLen - vLen0)}\n${text.slice(from, marker)}`);
				vLen = indentsNVLen + (vLen - vLen0)
				vLen0 = indentsNVLen
				start = marker // Set to start of the next line
				from = marker // Store the value of marker
				fastCheck = false
				continue mainLoop
			} while (false) // /searchBreakLine
			
			// console.debug('NN');
			start = i // Set to start of the next line
			vLen0 = 0 // Reset vLen0
			vLen = 0 // Reset vLen
		} // /mainLoop
		
		//console.debug(`OK:${from}\n${wrappedText}`);
		
		return {
			markers: markers,
			wrappedText:
					wrappedText.slice(0, wrappedText.length - indentsN.length) + text.slice(from, length) // CAVEAT: Don't omit `wrappedText.length` from the second argument of .slice()! Maybe: indentsN.length===0
		}
	}
	
	private getVisualLength(s: string): number {
		return s.length + this.tabLength_1 * (s.split('\t').length - 1) // (s.split('\t').length-1) counts '\t's in `s`
	}
	
	// private reduceToVisualLength(s: string, visualLen: number): number {
	// 	const l = s.length;
	// 	let i = 0;
	//
	// 	if (visualLen > l)
	// 		for (let j = 0; i < l && j < visualLen; ++i)
	// 			j += s[i] === '\t' ? this.tabLength : 1;
	// 	else
	// 		for (let j = 0; j < visualLen; ++i)
	// 			j += s[i] === '\t' ? this.tabLength : 1;
	//
	// 	return i;
	// }
}

export interface WrapResult {
	markers: number[]
	wrappedText: string
}

export interface WrapStyle {
	continuationIndent?: string
	tabLength?: number
	wrapOn?: number
}

export const DEF_WRAP_STYLE: WrapStyle = {
	continuationIndent: '',
	tabLength: 4,
	wrapOn: 120
}
