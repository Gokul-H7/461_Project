"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var process = require("process");
var child_process_1 = require("child_process");
var metrics_1 = require("./metrics"); // Assuming you already have metric.ts transpiled
var fs = require("fs");
function install() {
    try {
        console.log("Installing dependencies...");
        (0, child_process_1.execSync)('npm install', { stdio: 'inherit' }); // You can also change this to pip or any package manager
        console.log("Dependencies installed successfully.");
        process.exit(0);
    }
    catch (error) {
        console.error("Error installing dependencies:", error);
        process.exit(1);
    }
}
function test() {
    try {
        console.log("Running tests...");
        (0, child_process_1.execSync)('npm test', { stdio: 'inherit' });
        var coverageOutput = (0, child_process_1.execSync)('npm run coverage', { stdio: 'pipe' }).toString(); // Assuming you have a coverage script
        console.log(coverageOutput);
        process.exit(0);
    }
    catch (error) {
        console.error("Error running tests:", error);
        process.exit(1);
    }
}
function urlFile(filePath) {
    try {
        var urls = fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean);
        var results = urls.map(function (url) {
            if (isValidUrl(url)) {
                return (0, metrics_1.calculateMetrics)(url); // Calculate metrics for each valid URL
            }
            else {
                console.error("Invalid URL: ".concat(url));
                return null;
            }
        }).filter(function (result) { return result !== null; });
        results.forEach(function (result) {
            console.log(JSON.stringify(result)); // Output NDJSON
        });
        process.exit(0);
    }
    catch (error) {
        console.error("Error processing the file:", error);
        process.exit(1);
    }
}
function isValidUrl(url) {
    var npmjsPattern = /^https:\/\/www\.npmjs\.com\/package\/.+/;
    var githubPattern = /^https:\/\/github\.com\/.+\/.+/;
    return npmjsPattern.test(url) || githubPattern.test(url);
}
function main() {
    var args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('No command provided.');
        process.exit(1);
    }
    var command = args[0];
    switch (command) {
        case 'install':
            install();
            break;
        case 'test':
            test();
            break;
        default:
            if (isValidUrl(command)) {
                urlFile(command);
            }
            else {
                console.error('Invalid command or URL');
                process.exit(1);
            }
            break;
    }
}
main();
