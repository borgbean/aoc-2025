import { getAndSaveInput } from "./util/aoc.js";


function day10(input) {
    let lines = input.trim().split('\n');
    
    let result = 0;
    
    for(let line of lines) {
        let indicator = line.split(']')[0].substring(1);
        let joltageReq = line.split('{')[1];
        joltageReq = joltageReq.substring(0, joltageReq.length-1)
        
        let rex = /\((\d(,\d)*)\)/g;
        let schematics = [...line.matchAll(rex)].map(x => x[1]).map(x => x.split(',').map(Number));
        
        let indicatorMask = 0;
        {
            let bit = 1;
            for(let i = 0; i < indicator.length; ++i) {
                if(indicator[i] === '#') {
                    indicatorMask += bit;
                }
                bit <<= 1;
            } 
        }
        
        let best = Infinity;
        for(let i = 0; i < (1<<schematics.length); ++i) {
            let curMask = 0;
            
            for(let j = 1, schIdx = 0; j <= i; j <<= 1, ++schIdx) {
                if(i&j) {
                    for(let ind of schematics[schIdx]) {
                        curMask ^= (1<<ind);
                    }
                }
            }
            
            if(curMask === indicatorMask) {
                best = Math.min(best, popcnt(i));
            }
        }
        
        result += best;
    }
    
    return result;
}
    
function popcnt(n) {  //shamelessly stolen from google
  n = n - ((n >> 1) & 0x55555555)
  n = (n & 0x33333333) + ((n >> 2) & 0x33333333)
  return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24
}
    
console.log(day10(await getAndSaveInput('10')));
