const INIT_SEGMENTS = 0,
    CONSIDER_SEGMENT = 1,
    MOVE_RIGHTMOST = 2;
    

function * day5(input) {
    let freshList = input.split('\n\n')[0].split('\n').map(x => x.split('-').map(Number));
    
    freshList.sort((a, b) => (a[0]-b[0]));
    
    yield [INIT_SEGMENTS, freshList];
    
    let count = 0;
    let rightmost = -1;
    
    let idx = 0;
    for(let [l, r] of freshList) {
        count += 1 + r-l;
        if(rightmost >= l) {
            count -= 1 + Math.min(rightmost, r) - l;
        }
        rightmost = Math.max(rightmost, r);
        yield [CONSIDER_SEGMENT, idx++];
        yield [MOVE_RIGHTMOST, rightmost];
    }
    
    return count;

}




function drawFrame(div1, div2, speed, data, drawState, bigness) {
    if(!drawState.initialized) {
        drawState.initialized = true;
                
        drawState.dwellRemaining = 0;
        
        div1.incnerHTML = '';
        div2.incnerHTML = '';
        
        drawState.dwellIdx = 0;
    }
    
    if(drawState.dwellIdx > 1) {
        --drawState.dwellIdx;
        return true;
    }

    if(speed < 10) {
        if(drawState.dwellIdx !== 1) {
            drawState.dwellIdx = 10 - speed;
            return true;
        } else {
            drawState.dwellIdx = 0;
        }
    }
    speed -= 10;
    speed = Math.max(speed, 1);
        
    for(let i = 0; i < speed; ++i) {
        let next = data.next();
        if(next.done) { return false; }
        
        let [evt, evtData] = next.value;
        
        if(evt === INIT_SEGMENTS) {
            drawState.segments = evtData;
            
            drawState.lowerBound = evtData[0][0];
            drawState.upperBound = evtData.reduce((acc, x) => Math.max(acc, x[1]), 0);
            
            drawState.rightmost = 0;
            
            drawState.lookingAt = -1;
        }
        
        drawState.divisions = drawState.segments.length*bigness;
        drawState.perDivision = (drawState.upperBound - drawState.lowerBound)/drawState.divisions;
        
        if(evt === CONSIDER_SEGMENT) {
            drawState.lookingAt = evtData;
            if(i === (speed-1))
                div1.innerHTML = drawSegments();
        }
        if(evt === MOVE_RIGHTMOST) {
            drawState.rightmost = evtData;
            div2.innerHTML = drawProgress();
        }
    }
    
    function drawProgress() {
        let count = Math.max(0, Math.floor(((1+drawState.rightmost-drawState.lowerBound)/drawState.perDivision)-2));
                        
        return '@'.repeat(count);
    }
    
    //hella inefficient (:
    function drawSegments() {
        return drawState.segments
                    .map(([l, r], idx) => {
                        let start = (l-drawState.lowerBound)/drawState.perDivision;
                        let count = Math.max(0, Math.floor(((1+r-l)/drawState.perDivision)-2));
                        
                        let padding = '&nbsp;'.repeat(start);
                        let text = `<${'-'.repeat(count)}>`;
                        if(drawState.lookingAt === idx) {
                            if(drawState.rightmost >= l) {
                                let toCover = Math.ceil((drawState.rightmost - l)/drawState.perDivision);
                                if(toCover > 0) {
                                    text = `<span style="background-color:red">${text.slice(0, toCover+1)}</span>`
                                            + text.slice(toCover);
                                }
                            }
                            return `${padding}<span style="color:red">${text}</span>`;
                        }
                        return padding + text;
                    })
                    .join('<br>');
    }
    
    
    return true;
}












