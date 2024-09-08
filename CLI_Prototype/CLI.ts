import * as process from 'process';

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

function urlFile(url: string) {
    console.log(3);
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
            urlFile(command);
            break;
    }
}

main();