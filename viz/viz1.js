function day1(input) {
    let pos = 50;
    let ret = [];
    for(let line of input.split('\n')) {
        let dist = Number(line.substring(1));
        let invert = line[0] === 'L';
                
        if(invert) {
            pos -= dist;
        } else {
            pos += dist;
        }
        
        ret.push(pos);
    }
    
    return ret;
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
        
        drawState.idx = 0;
        drawState.position = 50;
        
        drawState.dwellRemaining = 0;
        
        drawState.count = 0;

    }
    
    if(drawState.dwellRemaining > 0) {
        --drawState.dwellRemaining;
        return true;
    }
    
    ctxt.fillStyle = 'black';
    ctxt.fillRect(0, 0, width, height);
    
    const radius = Math.floor(Math.min(width, height)/2);

    ctxt.strokeStyle = 'red';
    ctxt.beginPath();
    ctxt.arc(radius, radius, radius, 0, 2*Math.PI);
    ctxt.closePath();
    ctxt.stroke();
    
    const positionsPerFrame = speed;
    
    
    let target = data[drawState.idx];
    let start = drawState.position;
    if(target < drawState.position) {
        drawState.position = Math.max(target, drawState.position - positionsPerFrame);
    } else {
        drawState.position = Math.min(target, drawState.position + positionsPerFrame);
    }
    
    {
        let incCount = 0;
        let startPos = ((start % 100)+100)%100;
        let endPos = ((drawState.position % 100)+100)%100;
        let diff = drawState.position - start;
        if(drawState.position < start) {
            if(startPos === 0) { --incCount; }
            startPos = 99 - startPos;
            incCount += Math.max(0, Math.floor((startPos - diff)/100));
                
            if(endPos === 0) {
                ++incCount;
            }
        } else {
            incCount += Math.floor((startPos + diff)/100);
        }
        
        drawState.count += incCount;
    }
    
    ctxt.beginPath();
    ctxt.strokeStyle = 'green';
    ctxt.moveTo(radius, radius);
    let angle = (((drawState.position%100)+100)%100)/100 * 2 * Math.PI - Math.PI/2;
    ctxt.lineTo(radius + Math.cos(angle)*radius, radius + Math.sin(angle)*radius);
    ctxt.closePath();
    ctxt.stroke();
    
    ctxt.strokeStyle = 'white';
    ctxt.strokeText(drawState.count+'', 0, height-30);
    
    if(drawState.position === target) {
        ++drawState.idx;
        drawState.dwellRemaining = 3;
    }
    
        
    
    return drawState.idx < data.length;
}














