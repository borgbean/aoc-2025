import { getAndSaveInput } from "./util/aoc.js";

const DIRECTIONS = [[0, 1], [0, -1], [1, 0], [-1, 0]];
function day9(input) {
    let points = input.trim().split('\n').map(x => x.split(',').map(Number));
    
    let [xCoordsMapping, maxX] = clampCoordinates(points.map(x => x[0]));
    let [yCoordsMapping, maxY] = clampCoordinates(points.map(x => x[1]));
    
    let grid = new Array(maxY+1).fill(0).map(_ => new Array(maxX+1).fill(0));
    
    {
        let prevX = null, prevY = null;
        for(let point of points) {
            let x = xCoordsMapping.get(point[0]);
            let y = yCoordsMapping.get(point[1]);
            grid[y][x] = 1;
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
    
    let best = 0;
    
    for(let i = 0; i < points.length; ++i) {
        for(let j = 0; j < i; ++j) {
            let a = 1+Math.abs(points[i][0] - points[j][0]);
            let b = 1+Math.abs(points[i][1] - points[j][1]);
            
            let cur = a*b;
            if(cur < best || !isValid(points[i], points[j])) { continue; }
            
            best = cur;
        }
    }
    
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

console.time()
console.log(day9(await getAndSaveInput('9')));
console.timeEnd()
