import { getAndSaveInput } from "./util/aoc.js";

const DIRECTIONS = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, -1], [-1, 1], [1, -1]];
const DIRECTIONS_BACK = [[0, -1], [-1, 0], [-1, -1], [-1, 1]];

function day4(input) {
    let lines = input.split('\n').map(line => line.split(''));
    let w = lines[0].length;
    let h = lines.length;
    let result = 0;
    let q = [];


    for (let i = 0; i < h; ++i) {
        for (let j = 0; j < w; ++j) {
            let count = 0;
            if (lines[i][j] === '.') { continue; }
            for (let off of DIRECTIONS) {
                let i2 = i + off[0], j2 = j + off[1];

                if (i2 < 0 || j2 < 0 || i2 >= h || j2 >= w) {
                    continue;
                }
                if (lines[i2][j2] !== '.') { ++count; }
            }

            if (count < 4) {
                ++result;
                lines[i][j] = '.';


                for (let off of DIRECTIONS_BACK) {
                    let i2 = i + off[0], j2 = j + off[1];

                    if (i2 < 0 || j2 < 0 || i2 >= h || j2 >= w) {
                        continue;
                    }
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

        for (let off of DIRECTIONS) {
            let i2 = i + off[0], j2 = j + off[1];

            if (i2 < 0 || j2 < 0 || i2 >= h || j2 >= w) {
                continue;
            }
            if (lines[i2][j2] === '.') { continue; }

            if (--lines[i2][j2] === 3) {
                q.push(i2*w + j2);
            }
        }
    }

    return result;

}

console.log(day4(await getAndSaveInput('4')));
