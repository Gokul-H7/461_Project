import * as process from 'process';
//import * as fs from 'fs';

function install(): void {
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

function test(): void {
    try {
        console.log("Running tests...");
        execSync('npm test', { stdio: 'inherit' }); // Modify as needed for your test suite
        const coverageOutput = execSync('npm run coverage', { stdio: 'pipe' }).toString(); // Assuming you have a coverage script
        console.log(coverageOutput);
        process.exit(0);
    } catch (error) {
        console.error("Error running tests:", error);
        process.exit(1);
    }
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
