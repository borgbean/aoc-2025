import { getAndSaveInput } from "./util/aoc.js";


function day7(input) {

    let lines = input.split('\n');
    
    while(!lines.at(-1).length) {
        lines.pop();
    }
    
    let start = lines[0].indexOf('S');
    let positions = new Set([start]);
    let count = 0;
    
    for(let i = 1; i < lines.length; ++i) {
        let nextPositions = new Set();
        for(let position of positions) {
            if(i < 0 || i > lines[i].length) ;
            if(lines[i][position] === '^') {
                nextPositions.add(position-1);
                nextPositions.add(position+1);
                count += 1;
            } else {
                nextPositions.add(position);
            }
        }
        positions = nextPositions;
    }
    
    return count;
}

console.log(day7(await getAndSaveInput('7')));
