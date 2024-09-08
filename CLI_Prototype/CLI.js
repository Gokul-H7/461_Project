"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var process = require("process");
// WRITE A PROGRAM IN TYPESCRIPT THAT READS THE COMMAND LINE AND RUNS VARIOUS FUNCTIONS 
// POSSIBLE INPUTS CAN BE:
// ./run install
// ./run test
// ./run URL_FILE (URL_FILE IS ANY WEBSITE FOR NOW)
// each input should go to a different function and print out a different number for now
function install() {
    console.log(1);
}
function test() {
    console.log(2);
}
function urlFile(url) {
    console.log(3);
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
            urlFile(command);
            break;
    }
}
main();
