import * as process from 'process';
//import * as fs from 'fs';

function install() {
    console.log("installing...");
}

function test() {
    console.log("running tests...");
}

function urlFile(url: string) {
    console.log("reading from: ", url);
}

function isValidUrl(url: string): boolean {
    const npmjsPattern = /^https:\/\/www\.npmjs\.com\/package\/.+/;
    const githubPattern = /^https:\/\/github\.com\/.+\/.+/;
    return npmjsPattern.test(url) || githubPattern.test(url);
}

function main() {
    const args = process.argv.slice(2);
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
            if (isValidUrl(command)) {
                urlFile(command);
            } else {
                console.error('Invalid command or URL');
                process.exit(1);
            }
            break;
    }
}

main();