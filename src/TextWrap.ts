/**
 * @author [S. Mahdi Mir-Ismaili](https://mirismaili.github.io).
 * Created on 1398/2/6 (2019/4/26).
 */
import {initiateObject} from "./utilities";

export class TextWrap implements WrapStyle {
	private readonly tabLength_1: number;
	private readonly continuationIndentVLength: number;
	
	readonly continuationIndent: string;
	readonly tabLength: number;
	readonly wrapOn: number;
	
	// noinspection JSUnusedGlobalSymbols
	constructor(wrapStyle: WrapStyle = DEF_WRAP_STYLE) {
		initiateObject(this, wrapStyle, DEF_WRAP_STYLE);
		this.tabLength_1 = this.tabLength - 1;
		
		this.continuationIndentVLength = this.getVisualLength(this.continuationIndent);
	}
	
	private getVisualLength(s: string): number {
		return s.length + this.tabLength_1 * (s.split('\t').length - 1);  // (s.split('\t').length-1) counts '\t's in `s`
	}
	
	private reduceToVisualLength(s: string, visualLen: number): number {
		const l = s.length;
		let i = 0;
		
		if (visualLen > l)
			for (let j = 0; i < l && j < visualLen; ++i)
				j += s[i] === '\t' ? this.tabLength : 1;
		else
			for (let j = 0; j < visualLen; ++i)
				j += s[i] === '\t' ? this.tabLength : 1;
		
		return i;
	}
	
	wrap(text: string, indents: string): WrapResult {
		const markers: number[] = [];
		const tabLength = this.tabLength;
		const vLenBound = this.wrapOn + 1;
		const length = text.length;
		const indentsN = indents + this.continuationIndent;
		const indentsNVLen = this.getVisualLength(indentsN);
		
		let from = 0;
		let wrappedText = '';
		
		mainLoop: for (let i = 0, vLen = 0, vLen0 = 0, start = 0, marker = 0, c: string, fastCheck = false; i < length; ++i) {
			c = text[i];
			vLen += c === '\t' ? tabLength : 1;
			//console.log(`A: ${c} / ${vLen}`);
			
			searchBreakLine: do {
				if (c === '\n') break searchBreakLine;
				
				const isNotBreakable = /^[\S\x0A]$/.test(c); // [\S\x0A]: All non-breakable characters ('\n' already filtered)
				
				searchWhiteSpace: do {
					if (vLen > this.wrapOn) {
						if (fastCheck || (fastCheck = true) &&
								// The 2nd condition will always be true if the 1st is true. Actually, it is the main condition we
								// need to check, but we know in most cases (more than 95%) the 1st is true.
								(marker - start > indentsNVLen || this.getVisualLength(text.slice(start, marker)) > indentsNVLen)
						) {
							if (isNotBreakable) break searchWhiteSpace;
						} else {
							if (isNotBreakable) continue mainLoop;
							
							fastCheck = false;
						}
					} else if (isNotBreakable)
						continue mainLoop;
					
					// Any breakable character (white-space except '\n' and '\xA0'):
					
					marker = i + 1;		// Store the value of i
					vLen0 = vLen;	// Store the value of vLen
					continue mainLoop;
				} while (false); // /searchWhiteSpace
				
				markers.push(marker);
				wrappedText += text.slice(from, marker) + '\n' + indentsN;
				//console.log(`L: [${from}, ${marker}) - ${vLen} - ${indentsNVLen + (vLen - vLen0)}\n${text.slice(from, marker)}`);
				vLen = indentsNVLen + (vLen - vLen0);
				vLen0 = indentsNVLen;
				start = marker;	// Set to start of the next line
				from = marker;		// Store the value of marker
				fastCheck = false;
				continue mainLoop;
				
			} while (false); // /searchBreakLine
			
			console.log('NN');
			start = i;		// Set to start of the next line
			vLen0 = 0;		// Reset vLen0
			vLen = 0;		// Reset vLen
		} // /mainLoop
		
		console.log(`OK:${from}\n${wrappedText}`);
		
		return {
			markers: markers,
			wrappedText: wrappedText.slice(0, wrappedText.length - indentsN.length) + text.slice(from, length),  // CAVEAT: Don't omit `wrappedText.length` from the second argument of .slice()! Maybe: indentsN.length===0
		}
	}
	
	wrap0(text: string, indents: string): WrapResult0 {
		//console.debug(JSON.stringify(text));
		const lines: Line[] = [];
		const markers: number[] = [];
		let marker = 0;
		let wrappedText = '';
		
		//console.debug(`wrapOn: ${this.wrapOn} - Received indents: ${JSON.stringify(indents)} - lengthN: ${lengthN}`);
		const indentsN = indents + this.continuationIndent;
		const indentsNVLen = this.getVisualLength(indentsN);
		const lengthN = this.wrapOn - indentsNVLen;
		
		// 1. In zero-cycle loops this must NOT be `0`. See return statement.
		// 2. In first-cycle of below loops this must be `1`.
		let breakLineFound = 1;
		
		for (let i = 0; marker < text.length; ++i) {
			let length: number;
			let len: number;
			let line: string;
			let conditionalIndents: string;
			
			if (breakLineFound === 1) {
				length = this.wrapOn;
				conditionalIndents = '';
			} else {
				length = lengthN;
				conditionalIndents = indentsN;
			}
			
			len = this.reduceToVisualLength(text, length);  //console.debug(`Reduced-length (len): ${len}`);
			line = text.substr(marker, length = len); //console.debug(`line0: ${JSON.stringify(line)}`);
			// Store before-precess value of `len` to compare with its after-process value. See `process` label below.
			
			process:
			{
				let restText = text.slice(marker + len);
				breakLineFound = 0;
				len = line.indexOf('\n');
				
				if (len !== -1) {
					//console.debug(`Found break-line at: ${len}`);
					breakLineFound = 1;
					break process;
				}
				
				len = line.length;
				
				if (restText.length === 0) //{ console.debug(`Reached last line.`);
					break process;				//}
				
				const precededWSesInRest = /^[^\S\xA0]+/.exec(restText);
				//console.debug(`Found preceded white-spaces in the rest of the text: ${!!precededWSesInRest}\nrestText: ${JSON.stringify(restText)}`);
				
				if (precededWSesInRest !== null) {
					const i = precededWSesInRest[0].indexOf('\n');
					
					if (i === -1) {
						len += precededWSesInRest[0].length;
						break process;
					}
					
					//console.debug(`Found preceded break-line in \`restText\` at: ${i}`);
					breakLineFound = 1;
					len += i;
					
					break process;
				}
				
				const latestWSToEnd = /[^\S\xA0][\S\xA0]*?$/.exec(line);
				//console.debug(`Found latest white-space (+ subsequent characters to the end) in line: ${!!latestWSToEnd}\nline: ${JSON.stringify(line)}`);
				
				if (latestWSToEnd !== null) {
					len = latestWSToEnd.index + 1;
					
					// The second condition will always be true if the first is true. Actually, it is the main condition we
					// need to check, but we know in most cases (more than 95%) the first is true.
					if (len > indentsNVLen || this.getVisualLength(line.slice(0, len)) > indentsNVLen) break process;
					
					console.info(`OOPS! A bad state! Wrapping is useless in this state. We have to continue. len: ${len}`);
				}
				
				len = line.length;
				
				const firstWSesInRest = /[^\S\xA0]+/.exec(restText);
				//console.debug(`Found first occurrence of white-spaces in the rest of the text: ${!!firstWSesInRest}\nrestText: ${JSON.stringify(restText)}`);
				
				if (firstWSesInRest === null) {
					console.info(`Couldn't wrap. No white-space find!`);
					len += restText.length;
					break process;
				}
				
				const i = firstWSesInRest[0].indexOf('\n');
				
				if (i === -1) {
					len += firstWSesInRest.index + firstWSesInRest[0].length;
					break process;
				}
				
				//console.debug(`Found break-line in \`restText\` at: ${i}`);
				breakLineFound = 1;
				len += firstWSesInRest.index + i;
				
				//break process;
			}
			
			line = conditionalIndents + (
					len === length ? line : text.substr(marker, len)  // Caveat: Don't get new value of line by slicing previous value of it! Maybe: len > length
			);
			wrappedText += line + '\n';
			marker += len + breakLineFound;
			lines.push({
				content: line,
				endOffset: marker,
				lineBreakAlreadyExists: breakLineFound === 1,
			});
			if (breakLineFound === 0) markers.push(marker);
			
			//console.log(`Wrapped at len: ${len}. marker: ${marker}, length: ${length}`);
			//console.log(line);
		}
		
		//console.debug(wrappedText);
		return {
			lines: lines,
			markers: markers,
			wrappedText: breakLineFound === 0 ? wrappedText.slice(0, -1) : wrappedText,
		}
	}
}

export interface WrapResult0 {
	lines: Line[];
	markers: number[];
	wrappedText: string;
}

export interface WrapResult {
	markers: number[];
	wrappedText: string;
}

export interface Line {
	content: string;
	endOffset: number;
	lineBreakAlreadyExists: boolean;
}

export interface WrapStyle {
	continuationIndent: string;
	tabLength: number;
	wrapOn: number;
}

export const DEF_WRAP_STYLE: WrapStyle = {
	continuationIndent: '',
	tabLength: 4,
	wrapOn: 120,
};
