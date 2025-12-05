import { getAndSaveInput } from "./util/aoc.js";


function day5(input) {
    let [a, b] = input.split('\n\n');
    
    let freshList = a.split('\n').map(x => x.split('-').map(Number));
    let availableList = b.split('\n').map(Number);
    
    freshList.sort((a, b) => (a[0]-b[0]));
    availableList.sort((a, b) => a-b);
    
    
    let l = 0;
    let count = 0;
    for(let id of availableList) {
        while(l < freshList.length) {
            let [left, right] = freshList[l];
            if(id >= left && id <= right) { 
                ++count;
                break;
            } else if(id > left) {
                ++l;
            } else {
                break;
            }
        }
    }
    
    
    return count;

}

console.log(day5(await getAndSaveInput('5')));
