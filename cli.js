"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var process = require("process");
//import * as fs from 'fs';
function install() {
    console.log("installing...");
}
function test() {
    console.log("running tests...");
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
