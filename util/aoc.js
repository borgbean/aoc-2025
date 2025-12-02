import { env, loadEnvFile } from "process";
import * as fs from "fs/promises";
import path from "path";
import readInputToLines from "./util.js";

loadEnvFile('.env');

export async function getInput(problem) {
    console.log(`Fetching problem ${problem} input.`)
    let resp = await fetch(`https://adventofcode.com/2025/day/${problem}/input`, {
        "headers": {
            // "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
            // "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            // "Accept-Language": "en-US,en;q=0.5",
            // "Sec-GPC": "1",
            // "Upgrade-Insecure-Requests": "1",
            // "Sec-Fetch-Dest": "document",
            // "Sec-Fetch-Mode": "navigate",
            // "Sec-Fetch-Site": "same-origin",
            // "Priority": "u=0, i",
            // "Pragma": "no-cache",
            // "Cache-Control": "no-cache",
            "Cookie": env.ADVENT_COOKIE
        },
        "method": "GET",
        "mode": "cors"
    });

    if (!(resp.status >= 200 && resp.status < 300)) {
        let message = '';
        try {
            message = await resp.text();
        } catch (ignored) { }
        throw new Error(`Failed to fetch text from AOC - status ${resp.status} - ${message}`);
    }

    return resp.text();
}

export async function getAndSaveInput(problem, text) {
    const inputDir = env.INPUT_DIR;
    try {
        await fs.stat(inputDir);
    } catch (ignored) {
        await fs.mkdir(inputDir);
    }

    let outputFilename = path.join(inputDir, `${problem}.txt`);
    try {
        await fs.stat(outputFilename);
    } catch (ignored) {
        await fs.writeFile(outputFilename, await getInput(problem), 'utf8');

    }
    return fs.readFile(outputFilename, 'utf8');
}