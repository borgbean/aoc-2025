function day2(input) {
    let invalid = 0;
    let ret = [];
    for(let range of input.split(',')) {
        let [l, r] = range.split('-').map(Number);
        
        let startLen = (l+'').length;
        let endLen = (r+'').length;
        
        for(let idLen = startLen; idLen <= endLen; ++idLen) {
            let seen = new Set();
            for(let repeatLen = 1; (repeatLen+repeatLen) <= idLen; ++repeatLen) {
                if((idLen % repeatLen) !== 0) { continue; }
                let pow = 10**(repeatLen-1);
                let nextPow = pow*10;
                let idSegment = pow;
                let targetIdSegment = idSegment*10;
                
                
                for(let i = idSegment; i < targetIdSegment; ++i) {
                    let num = i;
                    for(let len = repeatLen; len < idLen; len += repeatLen) {
                        num *= nextPow;
                        num += i;
                    }
                    
                    if(num >= l && num <= r && !seen.has(num)) {
                        seen.add(num);
                        invalid += num;
                        ret.push([0, num]);
                    } else {
                        if(num > r) { break; }
                        if(seen.has(num)) {
                            ret.push([1, num]);
                        } else {
                            ret.push([2, num]);
                        }
                    }
                }
                
            }
        }
    }
    
    return ret;
}


function drawFrame(outDiv, attemptDiv, speed, data, drawState) {
    if(!drawState.initialized) {
        drawState.initialized = true;
        
        drawState.idx = 0;
        
        drawState.dwellRemaining = 0;
        
        outDiv.innerHTML = '';
    }
    
    if(drawState.dwellRemaining > 0) {
        --drawState.dwellRemaining;
        return true;
    }
    
    let jump = speed;
    for(let i = 0; i < jump; ++i) {
        let [result, num] = data[drawState.idx++];
        attemptDiv.innerHTML = num;
        if(result === 0) {
            outDiv.innerHTML = `${num}<br>${outDiv.innerHTML}`;
            break;
        }
    }
    
    
    
        
    
    return drawState.idx < data.length;
}












