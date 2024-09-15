import * as process from 'process';
import { execSync } from 'child_process'
import { calculateMetrics } from './metrics';  // Assuming you already have metric.ts transpiled
import * as fs from 'fs';

function install(): void {
    try {
        console.log("Installing dependencies...");
        execSync('npm install', { stdio: 'inherit' });  // You can also change this to pip or any package manager
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
        execSync('npm test', { stdio: 'inherit' });
        const coverageOutput = execSync('npm run coverage', { stdio: 'pipe' }).toString();  // Assuming you have a coverage script
        console.log(coverageOutput);
        process.exit(0);
    } catch (error) {
        console.error("Error running tests:", error);
        process.exit(1);
    }
}

function urlFile(filePath: string): void {
    try {
        const urls = fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean);
        const results = urls.map(url => {
            if (isValidUrl(url)) {
                return calculateMetrics(url);  // Calculate metrics for each valid URL
            } else {
                console.error(`Invalid URL: ${url}`);
                return null;
            }
        }).filter(result => result !== null);
        
        results.forEach(result => {
            console.log(JSON.stringify(result));  // Output NDJSON
        });

        process.exit(0);
    } catch (error) {
        console.error("Error processing the file:", error);
        process.exit(1);
    }
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
