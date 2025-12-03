import { getAndSaveInput } from "./util/aoc.js";

function day3(input) {
    let ret = 0;
    for(let line of input.split('\n')) {
        if(!line.trim()) { continue; }
        let best1 = -1, best2 = -1;
        for(let i = 0; i < line.length; ++i) {
            let digit = Number(line[i]);
            if(i === (line.length-1)) {
                best2 = Math.max(best2, digit);
            } else {
                if(digit > best1) {
                    best1 = digit;
                    best2 = -1;
                } else if(digit > best2) {
                    best2 = digit;
                }   
            }
        }
        
        ret += best1*10 + best2;
    }
    
    return ret;
}

console.log(day3(await getAndSaveInput('3')));
