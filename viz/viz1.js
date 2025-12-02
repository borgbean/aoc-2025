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























/**
 * @template T
 */
class MinHeapMap {
    /**
     * @param {T[]} arr 
     * @param {number} size 
     * @param {boolean} alreadyHeapified 
     * @param {function(T, T): number} cmp 
     * @param {boolean} trackPositions 
     */
    constructor(arr, size, alreadyHeapified, cmp, trackPositions) {
        /**
         * @type {any[]}
         */
        this.heap = arr;
        /**
         * @type {number}
         */
        this.size = size;
        /**
         * @type {function(T, T): number}
         */
        this.cmp = cmp;

        if(!alreadyHeapified) {
            this._heapify();
        }

        /**
         * @type {boolean}
         */
        this.trackPositions = trackPositions;
        if(trackPositions) {
            /**
             * @type {Map<T, number>}
             */
            this.idxByElem = new Map();
            for(let i = 0; i < size; ++i) {
                this.idxByElem.set(arr[i], i);
            }
        }
    }

    /**
     * @param {T} val 
     * @returns {boolean}
     */
    has(val) {
        if(!this.trackPositions) { throw new Error('not tracking value positions...'); }
        return this.idxByElem.has(val);
    }
    /**
     * @param {T} oldVal 
     * @param {T} newVal 
     */
    decrease(oldVal, newVal) {
        if(this.cmp(newVal, oldVal) > 0) { throw new Error('improper use of decrease'); }
        if(!this.trackPositions) { throw new Error('not tracking value positions...'); }
        let idx = /** @type {number} */ (this.idxByElem.get(oldVal));
        this.idxByElem.delete(oldVal);
        this.idxByElem.set(newVal, idx);
        this.heap[idx] = newVal;
        
        this._pushUp(idx);
    }
    /**
     * @param {T} oldVal 
     * @param {T} newVal 
     */
    increase(oldVal, newVal) {
        if(this.cmp(newVal, oldVal) < 0) { throw new Error('improper use of decrease'); }
        if(!this.trackPositions) { throw new Error('not tracking value positions...'); }
        let idx = /** @type {number} */ (this.idxByElem.get(oldVal));
        this.idxByElem.delete(oldVal);
        this.idxByElem.set(newVal, idx);
        this.heap[idx] = newVal;

        this._pushDown(idx);
    }
    /**
     * @returns {T}
     */
    peek() {
        if(this.size < 1) { throw new Error('out of bounds'); }

        return this.heap[0];
    }
    /**
     * @returns {T}
     */
    pop() {
        if(this.size < 1) { throw new Error('out of bounds'); }

        let ret = this.heap[0];
        if(this.trackPositions) { this.idxByElem.delete(ret); }
        
        this.size -= 1;
        if(this.size > 0) {
            this.heap[0] = this.heap[this.size];
            if(this.trackPositions) { this.idxByElem.set(this.heap[0], 0); }
            
            this._pushDown(0);
        }

        return ret;
    }
    /**
     * @param {T} e 
     */
    push(e) {
        if((this.heap.length-1) <= this.size) {
            this.heap.length = this.heap.length * 2;
        }
        if(this.trackPositions) { 
            if(this.idxByElem.has(e)) { throw new Error('already had element...'); }
            this.idxByElem.set(e, this.size);
        }
        this.heap[this.size] = e;
        
        this._pushUp(this.size);
        this.size += 1;
    }
    /**
     * @param {number} idx1 
     * @param {number} idx2 
     */
    _swp(idx1, idx2) {
        [this.heap[idx1], this.heap[idx2]] = [this.heap[idx2], this.heap[idx1]];
        if(this.trackPositions) {
            this.idxByElem.set(this.heap[idx1], idx1);
            this.idxByElem.set(this.heap[idx2], idx2);
        }
    }
    /**
     * @param {number} idx 
     */
    _pushUp(idx) {
        while(idx > 0) {
            let p = Math.floor((idx-1)/2);
            
            let cmp = this.cmp(this.heap[idx], this.heap[p]);
            if(cmp < 0) {
                this._swp(idx, p);
                idx = p;
            } else {
                break;
            }
        }
    }
    /**
     * @param {number} idx 
     */
    _pushDown(idx) {
        while(true) {
            let l = idx*2 + 1;
            let r = l + 1;

            if(l >= this.size) { break; }

            let cmpL = this.cmp(this.heap[idx], this.heap[l]);
            let cmpR = -1;
            if(r < this.size) {
                cmpR = this.cmp(this.heap[idx], this.heap[r])
            }

            if(cmpL > 0 && cmpR > 0) {
                let cmpBoth = this.cmp(this.heap[l], this.heap[r]);
                let next = cmpBoth < 0 ? l : r;
                this._swp(idx, next);
                idx = next;
            } else if(cmpL > 0) {
                this._swp(idx, l);
                idx = l;
            } else if(cmpR > 0) {
                this._swp(idx, r);
                idx = r;
            } else {
                break;
            }
        }
    }

    _heapify() {
        for(let i= Math.floor(this.size/2) - 1; i>=0; --i) {
            this._pushDown(i);
        }
    }
}
