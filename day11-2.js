import { getAndSaveInput } from "./util/aoc.js";

function day11(input) {
    let adj = {};

    let vToIdx = new Map();
    
    for(let line of input.trim().split('\n')) {
        let [v1, v2s] = line.split(': ');
        
        adj[v1] ||= [];
        
        for(let v2 of v2s.split(' ')) {
            adj[v1].push(v2);
        }
    }
    
    {
        let idx = 0;
        for(let v in adj) {
            vToIdx.set(v, idx++);
        }
    }
    
    let seen = {};
    
    let dp = new Array(vToIdx.size*4).fill(0);
    
    return dfs('svr');
    
    function dfs(v1) {
        let dpIdx = vToIdx.get(v1)*4 + (seen['dac'] ? 2 : 0) + (seen['fft'] ? 1 : 0);
        if(dp[dpIdx]) {
            return dp[dpIdx]-1;
        }
        
        if(v1 === 'out') { 
            if(seen['dac'] && seen['fft']) {
                 return 1;
            }
            return 0;
         }
         
        let ret = 0;
        for(let v2 of adj[v1]) {
            seen[v2] = true;
            ret += dfs(v2);
            seen[v2] = false;
        }
        
        dp[dpIdx] = ret+1;
        
        return ret;
    }
    
    
    
}

console.log(day11(await getAndSaveInput('11')));
