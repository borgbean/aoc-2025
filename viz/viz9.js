let INIT_FIELD = 0,
    TRY_PAIR = 1,
    UPDATE_RESULT = 2;

const DIRECTIONS = [[0, 1], [0, -1], [1, 0], [-1, 0]];
function * day9(input) {
    let points = input.trim().split('\n').map(x => x.split(',').map(Number));
    
    let [xCoordsMapping, maxX] = clampCoordinates(points.map(x => x[0]));
    let [yCoordsMapping, maxY] = clampCoordinates(points.map(x => x[1]));
    
    let grid = new Array(maxY+1).fill(0).map(_ => new Array(maxX+1).fill(0));
    
    {
        let prevX = null, prevY = null;
        for(let point of points) {
            let x = xCoordsMapping.get(point[0]);
            let y = yCoordsMapping.get(point[1]);
            grid[y][x] = 2;
            if(prevX !== null) {
                drawLine(prevX, prevY, x, y);
            }
            
            prevX = x, prevY = y;
        }
        
        //back to start
        drawLine(prevX, prevY, xCoordsMapping.get(points[0][0]), yCoordsMapping.get(points[0][1]));
    }
    
    //spread landmines around the outside
    flood(0, 0);
    
    yield [INIT_FIELD, grid];
    
    let best = 0;
    
    for(let i = 0; i < points.length; ++i) {
        for(let j = 0; j < i; ++j) {
            let a = 1+Math.abs(points[i][0] - points[j][0]);
            let b = 1+Math.abs(points[i][1] - points[j][1]);
            
            let cur = a*b;
            let worked = isValid(points[i], points[j]);
            yield [TRY_PAIR, 
                [worked,
                xCoordsMapping.get(points[i][0]),
                yCoordsMapping.get(points[i][1]),
                xCoordsMapping.get(points[j][0]),
                yCoordsMapping.get(points[j][1])]
            ];
            
            if(worked && cur > best) {
                best = cur;
                yield [UPDATE_RESULT, best];
            }
        }
    }
    
    console.log(best);
    
    return best;
    
    
    
    
    function drawLine(x1, y1, x2, y2) {
        let xx = x1, yy = y1;
        if(xx === x2) {
            yy += yy > y2 ? -1 : 1;
        } else {
            xx += xx > x2 ? -1 : 1;
        }
        while(yy !== y2 || xx !== x2) {
            grid[yy][xx] = 1;
            if(xx === x2) {
                yy += yy > y2 ? -1 : 1;
            } else {
                xx += xx > x2 ? -1 : 1;
            }
        }
    }
    
    function isValid(point1, point2) {
        let x1 = xCoordsMapping.get(point1[0]), y1 = yCoordsMapping.get(point1[1]);
        let x2 = xCoordsMapping.get(point2[0]), y2 = yCoordsMapping.get(point2[1]);
        
        let left = Math.min(x1, x2), right = Math.max(x1, x2);
        let top = Math.max(y1, y2), bottom = Math.min(y1, y2);
        
        for(let y = bottom; y <= top; y += 2) {
            for(let x = left; x <= right; x += 2) {
                if(grid[y][x] === -1) { return false; } // you sunk my battleship
            }
        }
        
        return true;
    }
    
    function flood(i, j) {
        let q = [i*grid[0].length+j];
        
        grid[i][j] = -1;
        
        while(q.length) {
            let dp = q.pop();
            let i = Math.floor(dp/grid[0].length);
            let j = dp % grid[0].length;
            
            for(let off of DIRECTIONS) {
                let i2 = i + off[0];
                let j2 = j + off[1];
                
                if(i2 < 0 || j2 < 0 || i2 >= grid.length || j2 >= grid[0].length) { continue; }
                
                if(grid[i2][j2]) { continue; }
                grid[i2][j2] = -1;
                q.push(i2*grid[0].length+j2);
            }
        }
        
    }
    
    function clampCoordinates(coords) {
        let coordMax = 1;
        
        coords.sort((a, b) => a-b);
        let coordsMapping = new Map();
        
        for(let i = 0; i < coords.length; ++i) {
            if(!coordsMapping.has(coords[i])) {
                coordsMapping.set(coords[i], coordMax);
                coordMax += 2;
            }
        }
        
        return [coordsMapping, coordMax - 1];
    }
}




/**
 * 
 * @param {CanvasRenderingContext2D} ctxt 
 * @param {number} width 
 * @param {number} height 
 * @param {number} speed 
 * @param {string} data 
 * @param {*} drawState 
 */
function drawFrame(ctxt, ctxt2, width, height, speed, data, drawState, resultDiv) {
    if(!drawState.initialized) {
        drawState.initialized = true;
        drawState.dwellIdx = 0;

    
        let field = data.next().value[1];
            
        drawState.field = field;
        
        for(let i = 0; i < drawState.field.length; ++i) {
            for(let j = 0; j < drawState.field[0].length; ++j) {
                if(!drawState.field[i][j]) {
                    drawState.field[i][j] = 1;
                }
            }
        }
        

        ctxt.fillStyle = 'black';
        ctxt.fillRect(0, 0, width, height);
        
        drawState.multX = width/drawState.field[0].length;
        drawState.multY = height/drawState.field.length;
        for(let i = 0; i < drawState.field.length; ++i) {
            for(let j = 0; j < drawState.field[0].length; ++j) {
                let val = drawState.field[i][j];
                if(val >= 1) {
                    if(val === 1) {
                        ctxt.fillStyle = 'green';
                    } else {
                        ctxt.fillStyle = 'red';
                    }
                    ctxt.fillRect(j*drawState.multX, i*drawState.multY, drawState.multX, drawState.multY);
                }
            }
        }
        
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
        
        let draw = i === (speed-1);
        
        if(evt === TRY_PAIR) {
            if(draw) {
                ctxt2.clearRect(0, 0, width, height);
                let [worked, x1, y1, x2, y2] = evtData;
                if(worked) {
                    ctxt2.fillStyle = 'yellow';
                } else {
                    ctxt2.fillStyle = 'blue';
                }
                
                ctxt2.fillRect(x1*drawState.multX, y1*drawState.multY, (x2-x1)*drawState.multX, (y2-y1)*drawState.multY);
            }
        } else if(evt === UPDATE_RESULT) {
            console.log(evtData)
            resultDiv.innerHTML = evtData;
        }
    }
    return true;

}














