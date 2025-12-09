import { getAndSaveInput } from "./util/aoc.js";


function day9(input) {    
    let points = input.trim().split('\n').map(x => x.split(',').map(Number));
    
    
    let best = 0;
    for(let i = 0; i < points.length; ++i) {
        for(let j = 0; j < i; ++j) {
            let a = 1+Math.abs(points[i][0] - points[j][0]);
            let b = 1+Math.abs(points[i][1] - points[j][1]);
            
            best = Math.max(best, a*b);
        }
    }
    
    return best;
}

console.log(day9(await getAndSaveInput('9')));
