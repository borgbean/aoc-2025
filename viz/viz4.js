const LOOK_AT_SQUARE = 0,
    LOOK_AT_ADJ_SQUARE = 1,
    BALEET_SQUARE = 2,
    INIT_GRID = 3;
    
const DIRECTIONS = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, -1], [-1, 1], [1, -1]];
const DIRECTIONS_BACK = [[0, -1], [-1, 0], [-1, -1], [-1, 1]];

function * day4(input) {
    let lines = input.split('\n').map(line => line.split(''));
    let w = lines[0].length;
    let h = lines.length;
    let result = 0;
    let q = [];


    yield [INIT_GRID, lines];
    
    for (let i = 0; i < h; ++i) {
        for (let j = 0; j < w; ++j) {
            yield [LOOK_AT_SQUARE, [i, j]];
            
            let count = 0;
            if (lines[i][j] === '.') { continue; }
            for (let off of DIRECTIONS) {
                let i2 = i + off[0], j2 = j + off[1];

                if (i2 < 0 || j2 < 0 || i2 >= h || j2 >= w) {
                    continue;
                }
                yield [LOOK_AT_ADJ_SQUARE, [i2, j2]];
                
                if (lines[i2][j2] !== '.') {
                    ++count;
                }
            }

            if (count < 4) {
                ++result;
                lines[i][j] = '.';
                yield [BALEET_SQUARE, [i, j]];


                for (let off of DIRECTIONS_BACK) {
                    let i2 = i + off[0], j2 = j + off[1];
                    
                    if (i2 < 0 || j2 < 0 || i2 >= h || j2 >= w) {
                        continue;
                    }
                    yield [LOOK_AT_ADJ_SQUARE, [i2, j2]];
                    if (lines[i2][j2] === '.') { continue; }
                    
                    if (--lines[i2][j2] === 3) {
                        q.push(i2*w + j2);
                    }
                }
            } else {
                lines[i][j] = count;
            }
        }
    }

    while (q.length) {
        let dpIdx = q.pop();
        let i = Math.floor(dpIdx/w), j = dpIdx%w;
        ++result;
        lines[i][j] = '.';
        yield [LOOK_AT_SQUARE, [i, j]];
        yield [BALEET_SQUARE, [i, j]];

        for (let off of DIRECTIONS) {
            let i2 = i + off[0], j2 = j + off[1];

            if (i2 < 0 || j2 < 0 || i2 >= h || j2 >= w) {
                continue;
            }
            if (typeof lines[i2][j2] !== 'number') { continue; }
            
            yield [LOOK_AT_ADJ_SQUARE, [i2, j2]];

            if (--lines[i2][j2] === 3) {
                q.push(i2*w + j2);
            }
        }
    }

}




function drawFrame(div1, div2, speed, data, drawState) {
    if(!drawState.initialized) {
        drawState.initialized = true;
                
        drawState.dwellRemaining = 0;
        
        div1.innerHTML = '';
        
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
        
        if(evt === INIT_GRID) {
            drawState.grid = evtData.slice().map(x => x.slice());
            if(i === (speed-1))
                div1.innerHTML = drawGrid();
        }
        if(evt === LOOK_AT_SQUARE) {
            drawState.lookingAt = evtData;
            drawState.lookingAtAdj = null;
            if(i === (speed-1))
                div1.innerHTML = drawGrid();
        }
        if(evt === LOOK_AT_ADJ_SQUARE) {
            drawState.lookingAtAdj = evtData;
            if(i === (speed-1))
                div1.innerHTML = drawGrid();
        }
        if(evt === BALEET_SQUARE) {
            drawState.grid[evtData[0]][evtData[1]] = '.';
            if(i === (speed-1))
                div1.innerHTML = drawGrid();
        }
    }
    
    //hella inefficient (:
    function drawGrid() {
        let toDraw = drawState.grid.slice();
        if(drawState.lookingAt) {
            let [i, j] = drawState.lookingAt;
            toDraw[i] = toDraw[i].slice();
            toDraw[i][j] = `<b style="background-color:green;">${toDraw[i][j]}</b>`;
        }
        if(drawState.lookingAtAdj) {
            let [i, j] = drawState.lookingAtAdj;
            toDraw[i] = toDraw[i].slice();
            toDraw[i][j] = `<b style="background-color:red">${toDraw[i][j]}</b>`;
        }
        
        return toDraw.map(x => x.join('')).join('<br>')
    }
    
    
    return true;
}












