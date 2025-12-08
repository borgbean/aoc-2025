import { getAndSaveInput } from "./util/aoc.js";
import MinHeapMap from "./util/heap.js";


function day8(input) {
    let lines = input.trim().split('\n').map(x => x.split(',').map(Number));
    
    
    let indexes = new Int32Array((lines.length*(lines.length-1))/2);
    let distances = new Float64Array(lines.length*lines.length);
    let idx = 0;
    
    for(let i = 1; i < lines.length; ++i) {
        for(let j = 0; j < i; ++j) {
            indexes[idx++] = i*lines.length + j;
            distances[i*lines.length + j] = dist(lines[i], lines[j]);
        }
    }
    
    let h = new MinHeapMap(indexes, indexes.length, false, (a, b) => {
        return distances[a] - distances[b];
    }, false);
    
    
    let groups = new Array(lines.length).fill(0).map((_, idx) => idx);
    
    for(let i = 0; i < 1000; ++i) { 
        let idx = h.pop();
        let v1 = Math.floor(idx/lines.length);
        let v2 = idx%lines.length;
        
        let g1 = findRoot(v1);
        let g2 = findRoot(v2);
        
        if(g1 === g2) { continue; }
        
        groups[g1] = g2;
    }
    
    let groupCounts = new Array(lines.length).fill(0);
    
    for(let i = 0; i < groups.length; ++i) {
        groupCounts[findRoot(i)] += 1;
    }
    
    groupCounts.sort((a, b) => b-a);
    
    return groupCounts.slice(0, 3).reduce((acc, x) => acc*x, 1)
        
    function findRoot(g) {
        while(groups[g] !== g) {
            g = groups[g];
        }
        
        return g;
    }
    
    function dist(a, b) {
        return ((a[0]-b[0])**2)
            +
            ((a[1]-b[1])**2)
            +
            ((a[2]-b[2])**2);
    }
}

console.log(day8(await getAndSaveInput('8')));
