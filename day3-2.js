import { getAndSaveInput } from "./util/aoc.js";

function day3(input) {
    let ret = 0;
    for(let line of input.split('\n')) {
        if(!line.trim()) { continue; }
        
        let stack = [];
        a: for(let i = 0; i < line.length; ++i) {
            let digit = Number(line[i]);
            let remaining = (line.length) - i;
            
            let minLen = Math.max(0, (12 - remaining));
            while(stack.length > minLen) {
                if(stack.at(-1) < digit) {
                    stack.pop();
                } else {
                    break;
                }
            }
            
            if(stack.length < 12) {
                stack.push(digit);
            }
        }
                
        let pow = 1;
        for(let i = stack.length-1; i >= 0; --i) {
            ret += pow*stack[i];
            pow *= 10;
        }
        
    }
    
    return ret;
}

console.log(day3(await getAndSaveInput('3')));
