import { getAndSaveInput } from "./util/aoc.js";

function day11(input) {
    let adj = {};

    for(let line of input.trim().split('\n')) {
        let [v1, v2s] = line.split(': ');
        
        adj[v1] ||= [];
        
        for(let v2 of v2s.split(' ')) {
            adj[v1].push(v2);
        }
    }
    
    return dfs('you');
    
    function dfs(v1) {
        if(v1 === 'out') { return 1; }
        
        let ret = 0;
        for(let v2 of adj[v1]) {
            ret += dfs(v2);
        }
        
        return ret;
    }
    
}

console.log(day11(await getAndSaveInput('11')));
