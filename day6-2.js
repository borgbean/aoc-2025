import { getAndSaveInput } from "./util/aoc.js";


function day6(input) {
    
    let lines = input.split('\n');
    while(!lines.at(-1).length) {
        lines.pop(); //trim newlines
    }
    
    let sizes = [];
    let cols, ops;
    {
        let opLine = lines.at(-1);
        lines.pop();
        let size = 0;
        for(let i = 0; i < opLine.length; ++i) {
            if(opLine[i] !== ' ' && size > 0) {
                sizes.push(size - 1);
                size = 0;
            }
            ++size;
        }
        sizes.push(size);
        
        cols = new Array(sizes.length).fill(0).map(_ => []);
        
        ops = opLine.split(/\s+/);
    }
    

    for(let line of lines) {
        let l = 0;
        for(let col = 0; col < sizes.length; ++col) {
            let size = sizes[col];
            
            for(let i = 0; i < size; ++i) {
                let digit = line[l++];
                if(digit === ' ') { continue; }
                while(i >= cols[col].length) {
                    cols[col].push(0);
                }
                
                cols[col][i] *= 10;
                cols[col][i] += Number(digit);
            }
            ++l;//space
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

console.log(day6(await getAndSaveInput('6')));
