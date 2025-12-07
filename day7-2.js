import { getAndSaveInput } from "./util/aoc.js";


function day7(input) {

    let lines = input.split('\n');
    
    while(!lines.at(-1).length) {
        lines.pop();
    }
    
    let start = lines[0].indexOf('S');
    
    let dp = new Array(lines[0].length).fill(0);
    let dp2 = dp.slice();
    
    dp[start] = 1;
    
    for(let i = 0; i < (lines.length-1); ++i) {
        dp2.fill(0);
        for(let j = 0; j < lines[i].length; ++j) {
            if(dp[j] === 0) { continue; }
            
            if(lines[i+1][j] === '^') {
                dp2[j+1] += dp[j];
                dp2[j-1] += dp[j];
            } else {
                dp2[j] += dp[j];
            }
        }
        [dp, dp2] = [dp2, dp];
    }
    
    return dp2.reduce((acc, x) => acc+x);
}

console.time()
console.log(day7(await getAndSaveInput('7')));
console.timeEnd()
