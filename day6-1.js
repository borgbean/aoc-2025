import { getAndSaveInput } from "./util/aoc.js";


function day6(input) {
    let lines = input.trim().split('\n');
    
    let cols, ops;
    {
        cols = new Array(lines[0].split(/\s+/).filter(x => x.length).length).fill(0).map(_ => []);
        
        ops = lines.at(-1).split(/\s+/);
    }
    

    for(let line of lines) {
        if(line[0] !== ' ' && !numeric(line.charCodeAt(0))) {
            break;
        }
        
        let col = 0;
        for(let num of line.split(/\s+/).filter(x => x.length)) {
            cols[col++].push(Number(num));
        }
    }

    let total = 0;
    for(let i = 0; i < ops.length; ++i) {
        if(ops[i] === '+') {
            total += cols[i].reduce((acc, x) => acc+x);
        } else if(ops[i] === '*') {
            total += cols[i].reduce((acc, x) => acc*x);
        }
    }

    return total;
}

function numeric(chr) {
    return (chr - '0'.charCodeAt(0)) < 9 
            && (chr - '0'.charCodeAt(0)) >= 0; 
}

console.log(day6(await getAndSaveInput('6')));
