const LOOK_AT_LINE = 0,
    LOOK_AT_COLUMN = 1,
    UPDATE_DP = 2,
    UPDATE_TOTAL = 3;
    
function * day7(input) {

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
        yield [LOOK_AT_LINE, [lines[i+1], dp]];
        for(let j = 0; j < lines[i].length; ++j) {
            if(dp[j] === 0) { continue; }
            
            yield [LOOK_AT_COLUMN, j];
            
            if(lines[i+1][j] === '^') {
                dp2[j+1] += dp[j];
                dp2[j-1] += dp[j];
            } else {
                dp2[j] += dp[j];
            }
            yield [UPDATE_DP, dp2]
        }
        [dp, dp2] = [dp2, dp];
    }
    
    yield [UPDATE_TOTAL, dp2.reduce((acc, x) => acc+x)];
}





function drawFrame(div1, div2, speed, data, drawState) {
    if(!drawState.initialized) {
        drawState.initialized = true;
                
        div2.innerHTML = '';
        
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
            return false;
        }
        
        let [evt, evtData] = next.value;
        
        if(evt === LOOK_AT_LINE) {
            drawState.line = evtData[0];
            drawState.lastDp = evtData[1];
            drawState.dp = [];
            drawState.curColumn = null;
            if(i === (speed-1)) {
                div2.innerHTML = '-';
                div1.innerHTML = drawTable();
            }
        }
        if(evt === LOOK_AT_COLUMN) {
            drawState.lookingAt = evtData;
        }
        if(evt === UPDATE_DP) {
            drawState.dp = evtData;
            if(i === (speed-1)) {
                div1.innerHTML = drawTable();
            }
        }
        if(evt === UPDATE_TOTAL) {
            div2.innerHTML = evtData;
        }
    }
    
    
    function drawTable() {
        let row0 = drawState.line;
        row0 = row0.split('');
        if(drawState.lookingAt) {
            let j = drawState.lookingAt;
            row0[j] = `<b style="background-color:green;">${row0[j]}</b>`;
        }
        row0 = row0.map(x => `<td>${x}</td>`).join('');
        
        let row1 = drawState.lastDp.map(x => `<td>${x}</td>`).join('')
        let row2 = drawState.dp.map(x => `<td>${x}</td>`).join('')
        return `<table><tr>${row1}</tr><tr>${row0}</tr><tr>${row2}</tr></table>`
    }
    
    
    return true;
}












