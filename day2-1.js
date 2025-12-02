import { getAndSaveInput } from "./util/aoc.js";

function day2(input) {
    let invalid = 0;
    for(let range of input.split(',')) {
        let [l, r] = range.split('-').map(Number);
        
        let startLen = (l+'').length;
        let endLen = (r+'').length;
        
        for(let idLen = startLen; idLen <= endLen; ++idLen) {
            if((idLen % 2) !== 0) { continue; }
            
            let seen = new Set();
            
            let repeatLen = idLen/2;
            let pow = 10**(repeatLen-1);
            let nextPow = pow*10;
            let idSegment = pow;
            let targetIdSegment = idSegment*10;
            
            
            for(let i = idSegment; i < targetIdSegment; ++i) {
                let num = i;
                for(let len = repeatLen; len < idLen; len += repeatLen) {
                    num *= nextPow;
                    num += i;
                }
                
                if(num >= l && num <= r && !seen.has(num)) {
                    seen.add(num);
                    invalid += num;
                }
            }
            
        }
    }
    
    return invalid;
}

console.log(day2(await getAndSaveInput('2')));
