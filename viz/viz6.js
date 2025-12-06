const INIT_GROUP = 0,
    ADD_DIGIT = 1,
    DO_OP = 2,
    UPDATE_TOTAL = 3;
    
function * day6(input) {
    
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
    
    let total = 0;

    let l = 0;
    for(let col = 0; col < sizes.length; ++col) {
        let size = sizes[col];
        
        let result = 0;
        if(ops[col] === '*') {
            result = 1;
        }
        
        yield [INIT_GROUP, [lines.map(x => x.slice(l, l+size)), ops[col], result]];
        
        for(let j = 0; j < size; ++j) {
            let sum = 0;
            for(let i = 0; i < lines.length; ++i) {
                if(lines[i][j+l] === ' ') {
                    if(sum > 0) { break; }
                    continue;
                }
                sum *= 10;
                sum += Number(lines[i][j+l]);
                
                yield [ADD_DIGIT, [[i, j], sum]];
            }
            
            if(ops[col] === '*') {
                result *= sum;
            } else {
                result += sum;
            }
            
            yield [DO_OP, result];
        }
        
        total += result;
        
        yield [UPDATE_TOTAL, total];
            
        l += size;
        ++l;
    }


    return total;
}





function drawFrame(div1, div2, speed, data, drawState) {
    if(!drawState.initialized) {
        drawState.initialized = true;
                
        drawState.dwellRemaining = 0;
        
        div1.innerHTML = '';
        
        drawState.dwellIdx = 0;
        drawState.total = 0;
    }
    
    if(drawState.dwellIdx > 1) {
        --drawState.dwellIdx;
        return true;
    }
    if(speed < 30) {
        if(drawState.dwellIdx !== 1) {
            drawState.dwellIdx = 30 - speed;
            return true;
        } else {
            drawState.dwellIdx = 0;
        }
    }
    speed -= 30;
    speed = Math.max(speed, 1);
    
    for(let i = 0; i < speed; ++i) {
        let next = data.next();
        if(next.done) { 
            div1.innerHTML = drawGrid();
            div2.innerHTML = drawState.total;
            return false;
        }
        
        let [evt, evtData] = next.value;
        
        if(evt === INIT_GROUP) {
            drawState.group = evtData[0];
            drawState.op = evtData[1];
            drawState.sum = 0;
            drawState.result = evtData[2];
            drawState.lookingAt = null;
            if(i === (speed-1))
                div1.innerHTML = drawGrid();
        }
        if(evt === ADD_DIGIT) {
            drawState.lookingAt = evtData[0];
            drawState.sum = evtData[1];
            if(i === (speed-1))
                div1.innerHTML = drawGrid();
        }
        if(evt === DO_OP) {
            drawState.result = evtData;
            if(i === (speed-1))
                div1.innerHTML = drawGrid();
        }
        if(evt === UPDATE_TOTAL) {
            drawState.total = evtData;
            if(i === (speed-1))
                div2.innerHTML = drawState.total;
        }
    }
    
    //hella inefficient (:
    function drawGrid() {
        let toDraw = drawState.group.slice();
        if(drawState.lookingAt) {
            let [i, j] = drawState.lookingAt;
            toDraw[i] = toDraw[i].split('');
            toDraw[i][j] = `<b style="background-color:green;">${toDraw[i][j]}</b>`;
            toDraw[i] = toDraw[i].join('');
        }
        
        return `<pre>${toDraw.join('<br>')}</pre><br>----<br>${drawState.sum}<br>${drawState.op}<br>----<br>${drawState.result}`;
    }
    
    
    return true;
}












