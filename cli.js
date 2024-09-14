"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var process = require("process");
//import * as fs from 'fs';
function install() {
    try {
        console.log("Installing dependencies...");
        execSync('pip install', { stdio: 'inherit' }); // Can also be npm install
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
        execSync('npm test', { stdio: 'inherit' }); // Assuming you're using npm for testing
        const coverageOutput = execSync('npm run coverage', { stdio: 'inherit' }); // Adjust based on your coverage tool
        console.log(coverageOutput.toString());
        process.exit(0);
    } catch (error) {
        console.error("Error running tests:", error);
        process.exit(1);
    }
}
function urlFile(url) {
    console.log("reading from: ", url);
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
