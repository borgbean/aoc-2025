import { getAndSaveInput } from "./util/aoc.js";


function day5(input) {
    let freshList = input.split('\n\n')[0].split('\n').map(x => x.split('-').map(Number));
    
    freshList.sort((a, b) => (a[0]-b[0]));
    
    
    let count = 0;
    let rightmost = -1;
    
    for(let [l, r] of freshList) {
        count += 1 + r-l;
        if(rightmost >= l) {
            count -= 1 + Math.min(rightmost, r) - l;
        }
        rightmost = Math.max(rightmost, r);
    }
    
    
    return count;

}

console.log(day5(await getAndSaveInput('5')));
