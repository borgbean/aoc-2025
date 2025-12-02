import { getAndSaveInput } from "./util/aoc.js";

function day1(input) {
    let pos = 50;
    let count = 0;
    for(let line of input.split('\n')) {
        let dist = Number(line.substring(1));
        let invert = line[0] === 'L';
        if(invert) {
            pos = 99 - pos;
        }
        
        pos += dist;
        pos %= 100;
        
        
        
        if(invert) {
            pos = 99 - pos;
        }
        
        if(pos === 0) { ++count; }
    }
    
    return count;
}

console.log(day1(await getAndSaveInput('1')));
