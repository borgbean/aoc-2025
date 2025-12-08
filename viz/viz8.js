let INIT_POINTS = 0,
    JOIN_POINTS = 1,
    RESULT = 2,
    UPDATE_COLOR = 3;

function * day8(input) {
    let lines = input.trim().split('\n').map(x => x.split(',').map(Number));
    
    yield [INIT_POINTS, lines];
    
    let indexes = new Array((lines.length*(lines.length-1))/2);
    let distances = new Float64Array(lines.length*lines.length);
    let idx = 0;
    
    for(let i = 1; i < lines.length; ++i) {
        for(let j = 0; j < i; ++j) {
            indexes[idx++] = i*lines.length + j;
            distances[i*lines.length + j] = dist(lines[i], lines[j]);
        }
    }
    
    indexes.sort((b, a) => {
        return distances[a] - distances[b];
    });
    
    
    let groups = new Array(lines.length).fill(0).map((_, idx) => idx);
    
    let linesByGroup = new Map();
    
    let groupCount = lines.length;
    while(true) {
        let idx = indexes.pop();
        let v1 = Math.floor(idx/lines.length);
        let v2 = idx%lines.length;
        
        let g1 = findRoot(v1);
        let g2 = findRoot(v2);
        
        if(g1 === g2) { continue; }
        
        if(!linesByGroup.has(g2)) {
            linesByGroup.set(g2, []);
        }
        
        yield [JOIN_POINTS, [v1, v2, g2]];
        
        if(linesByGroup.has(g1)) {
            for(let [v1, v2] of linesByGroup.get(g1)) {
                yield [UPDATE_COLOR, [v1, v2, g2]];
            }
            linesByGroup.get(g2).push(...linesByGroup.get(g1));
        }
        linesByGroup.get(g2).push([v1, v2]);
        
        
        if(--groupCount == 1) {
            yield [RESULT, lines[v1][0]*lines[v2][0]]
        }
        
        
        groups[g1] = g2;
    }
    
    
    
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




/**
 * 
 * @param {CanvasRenderingContext2D} ctxt 
 * @param {number} width 
 * @param {number} height 
 * @param {number} speed 
 * @param {string} data 
 * @param {*} drawState 
 */
function drawFrame(ctxt, width, height, speed, data, drawState) {
    if(!drawState.initialized) {
        drawState.initialized = true;
        drawState.dwellIdx = 0;

        ctxt.fillStyle = 'black';
        ctxt.fillRect(0, 0, width, height);
    
        let points = data.next().value[1];
            
        //project the 3 dimensions of the input onto 2 dimensions
        let maximums = [0, 0, 0];
        let minimums = [Infinity, Infinity, Infinity];
        
        for(let point of points) {
            for(let i = 0; i < 3; ++i) {
                maximums[i] = Math.max(maximums[i], point[i]);
                minimums[i] = Math.min(minimums[i], point[i]);
            }
        }
        let ordering = [0, 1, 2];
        ordering.sort((a, b) => (maximums[a]-minimums[a])-(maximums[b]-minimums[b]));
        drawState.points = new Array();
        //....
        
        for(let point of points) {
            let x = point[ordering[0]] - minimums[ordering[0]], 
                y = point[ordering[1]] - minimums[ordering[1]],
                z = point[ordering[2]] - minimums[ordering[2]];
                
            x *= maximums[ordering[0]];
            x += z;
            
            drawState.points.push([x, y]);
        }
        
        let maxX = drawState.points.reduce((acc, x) => Math.max(acc, x[0]), 0);
        let maxY = drawState.points.reduce((acc, x) => Math.max(acc, x[1]), 0);
        
        drawState.points = drawState.points.map(([x, y]) => {
            return [x*(width/maxX), y*(height/maxY)];
        })
        
        ctxt.fillStyle = 'white';
        for(let [x, y] of drawState.points) {
            ctxt.fillRect(x-1, y-1, 2, 2);
        }
        ctxt.strokeStyle = 'green';
        
        drawState.colorByGroup = new Map();
        
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
        
        if(evt === JOIN_POINTS || evt === UPDATE_COLOR) {
            if(evt === UPDATE_COLOR) { --i; }
            let [p1, p2, g] = evtData;
            
            if(!drawState.colorByGroup.has(g)) {
                drawState.colorByGroup.set(g, getRandomColor());
            }
            
            ctxt.strokeStyle = drawState.colorByGroup.get(g);
            
            ctxt.beginPath(); // Start a new path
            ctxt.moveTo(...drawState.points[p1]); // Move the pen to (30, 50)
            ctxt.lineTo(...drawState.points[p2]); // Draw a line to (150, 100)
            ctxt.closePath();
            ctxt.stroke(); // Render the path
        } else if(evt === RESULT) {
            return false;
        }
    }
    return true;
    
    
    
        
    function getRandomColor(){
        var red = Math.floor(Math.random() * 256);
        var green = Math.floor(Math.random() * 256);
        var blue = Math.floor(Math.random() * 256);

        return "rgb("+red+","+green+"," +blue+" )";  
    }

}














