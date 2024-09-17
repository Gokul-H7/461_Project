"use strict";
const { execSync } = require('child_process');  // Import execSync from child_process
const fs = require('fs');  // Import fs for file handling
const { performance } = require('perf_hooks');  // For latency calculation
const { calculateMetrics } = require('./metric');  // Import the metrics function from metric.js (after transpiling)

function install() {
    try {
        console.log("Installing dependencies...");
        execSync('npm install', { stdio: 'inherit' }); // Replace 'pip install' with 'npm install' if using Node.js
        console.log("Dependencies installed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error installing dependencies:", error);
        process.exit(1);
    }
}

function test() {
    try {
        console.log("Running tests...");
        execSync('npm test', { stdio: 'inherit' }); // Adjust based on your test setup
        const coverageOutput = execSync('npm run coverage', { stdio: 'inherit' }); // Modify based on your coverage tool
        console.log(coverageOutput.toString());
        process.exit(0);
    } catch (error) {
        console.error("Error running tests:", error);
        process.exit(1);
    }
}

function urlFile(filePath) {
    try {
        const urls = fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean);  // Read the file and split by line
        const results = urls.map(url => {
            if (isValidUrl(url)) {
                return calculateMetrics(url);  // Calculate the metrics for each URL
            } else {
                console.error(`Invalid URL: ${url}`);
                return null;
            }
        }).filter(result => result !== null);  // Filter out invalid results
        
        // Output each result as NDJSON
        results.forEach(result => {
            console.log(JSON.stringify(result));
        });

        process.exit(0);
    } catch (error) {
        console.error("Error processing the file:", error);
        process.exit(1);
    }
}

function isValidUrl(url) {
    const npmjsPattern = /^https:\/\/www\.npmjs\.com\/package\/.+/;
    const githubPattern = /^https:\/\/github\.com\/.+\/.+/;
    return npmjsPattern.test(url) || githubPattern.test(url);
}

function main() {
    const args = process.argv.slice(2);  // Slice out the first two default arguments
    if (args.length === 0) {
        console.error('No command provided.');
        process.exit(1);
    }

    const command = args[0];
    switch (command) {
        case 'install':
            install();
            break;
        case 'test':
            test();
            break;
        default:
            if (fs.existsSync(command)) {
                urlFile(command);  // If it's a file, process it
            } else {
                console.error('Invalid command or URL file path.');
                process.exit(1);
            }
            break;
    }
}

main();
