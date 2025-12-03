const LOOK_AT_LINE = 0,
    LOOK_AT_DIGIT = 1,
    LOOK_AT_STACK = 2,
    UPDATE_STACK = 3

function * day3(input) {
    let ret = 0;
    for(let line of input.split('\n')) {
        if(!line.trim()) { continue; }
        yield [LOOK_AT_LINE, line];
        
        let stack = [];
        a: for(let i = 0; i < line.length; ++i) {
            let digit = Number(line[i]);
            yield [LOOK_AT_DIGIT, i];
            let remaining = (line.length) - i;
            
            for(let j = Math.max(0, (12 - remaining)); j < stack.length; ++j) {
                yield [LOOK_AT_STACK, j];
                if(stack[j] < digit) {
                    stack[j] = digit;
                    stack = stack.slice(0, j+1)
                    yield [UPDATE_STACK, stack.join('')];
                    continue a;
                }
            }
            
            if(stack.length < 12) {
                stack.push(digit);
                yield [UPDATE_STACK, stack.join('')];
            }
        }
                
        let pow = 1;
        for(let i = stack.length-1; i >= 0; --i) {
            ret += pow*stack[i];
            pow *= 10;
        }
        
    }
    
    return ret;
}




function drawFrame(div1, div2, speed, data, drawState) {
    if(!drawState.initialized) {
        drawState.initialized = true;
                
        drawState.dwellRemaining = 0;
        
        div1.innerHTML = '';
        div2.innerHTML = '';
        
        drawState.dwellIdx = 0;
    }
    
    if(drawState.dwellIdx > 1) {
        --drawState.dwellIdx;
        return true;
    }
    if(speed < 15) {
        if(drawState.dwellIdx !== 1) {
            drawState.dwellIdx = 20 - speed;
            return true;
        } else {
            drawState.dwellIdx = 0;
        }
    }
    speed -= 15;
    speed = Math.max(speed, 1);
    
    for(let i = 0; i < speed; ++i) {
        let next = data.next();
        if(next.done) { return false; }
        
        let [evt, evtData] = next.value;
        
        if(evt === LOOK_AT_LINE) {
            drawState.line = evtData;
            div1.innerHTML = evtData;
            div2 = '';
        }
        if(evt === LOOK_AT_DIGIT) {
            div1.innerHTML = 
                `${drawState.line.substring(0,evtData)}<b>${drawState.line[evtData]}</b>${drawState.line.substring(evtData+1)}`;
        }
        if(evt === LOOK_AT_STACK) {
            div2.innerHTML = 
                `${drawState.stack.substring(0,evtData)}<b>${drawState.stack[evtData]}</b>${drawState.stack.substring(evtData+1)}`;
        }
        if(evt === UPDATE_STACK) {
            drawState.stack = evtData;
            div2.innerHTML = evtData;
        }
    }
    
    
    return true;
}












