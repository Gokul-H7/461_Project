// DEFINE INTERFACES

// Define the structure of the data returned by the GitHub API
interface RepositoryData {
    name: string;
    contributors: number;
    issues: Issue[];
    lastCommitDate: Date;
    pullRequests: number;
    license: string;
    files: File[];
}

// Define the structure of the data about Issues
interface Issue {
    state: string;
    created_at: string;
    closed_at: string | null;
    labels: string[] | null;
}

// Define the structure of the data about Files
interface File {
    fileName: string;
}

interface Metrics {
    busFactor: number;
    correctness: number;
    rampUpTime: number;
    responsiveness: number;
    licenseCompatibility: number;
}

interface LatencyTimes {
    busFactor: number;
    correctness: number;
    rampUpTime: number;
    responsiveness: number;
    licenseCompatibility: number;
}

interface Weights {
    busFactor: number;
    correctness: number;
    rampUpTime: number;
    responsiveness: number;
    licenseCompatibility: number;
}

// Fetch Data
async function fetchRepositoryData(repoUrl: string): Promise<RepositoryData> {
    // Simulate fetching data from GitHub API
    // In a real scenario, you would use fetch or axios to get data from GitHub API
    return {
        name: "example-repo",
        contributors: 10,
        issues: 5,
        pullRequests: 3,
        lastCommitDate: new Date('2023-10-01'),
        license: "MIT"
    };
}

// CALCULATE METRICS

/* Bus Factor:
*   - Bus factor is a measure of how many contributors are critical to a project
*       - Number of contributors
*/
function calculateBusFactor(data: RepositoryData): number {
    let busFactor = 0;
    for (let i = 1; i <= data.contributors; i++) {
        busFactor += 0.1;
        if (i == 1) {
            break;
        }
    }
    return busFactor;
}

/* Correctness:
*   - Correctness is a measure of the reliability and stability of the codebase
*       - Issues labeled as bugs
*       - Open/closed issue ratio
*/
function calculateCorrectness(data: RepositoryData): number {
    let correctness = 0;

    // number of open bugs
    const openBugIssues = data.issues.filter(issue => issue.state === 'open' && issue.labels && issue.labels.includes('bug')).length;

    // open/closed issue ratio
    const openIssues = data.issues.filter(issue => issue.state === 'open').length;
    const closedIssues = data.issues.filter(issue => issue.state === 'closed').length;
    const issueRatio = closedIssues > 0 ? openIssues / closedIssues : openIssues;

    if(issueRatio == 0){
        correctness = 1;
    }
    else if(issueRatio < 0.25){
        correctness = 0.8;
    }
    else if(issueRatio < 0.5){
        correctness = 0.6;
    }
    else if(issueRatio < 1){
        correctness = 0.4;
    }
    else if(issueRatio > 1){
        correctness = 0.2;
    }

    correctness = correctness * 1 / (1.15 ** openBugIssues);

    return correctness;
}

/* Ramp Up Time:
*   - Ramp up time is a measure of how much time is required for a new developer to become productive
*       - Presence of documentation (e.g. README)
*       - Size of codebase
*/
function calculateRampUpTime(data: RepositoryData): number {
    let rampUpTimeScore = 0;

    // Check for the presence of a README file
    const hasReadme = data.files.some(file => file.fileName.toLowerCase() === 'readme.md' || file.name.toLowerCase() === 'readme');

    if (hasReadme) {
        rampUpTimeScore += 0.5;
    }

    // Additional logic for size of codebase can be added here

    return rampUpTimeScore;
}

/* Responsiveness:
*   - Responsiveness is a measure of how quickly maintainers respond to issues and pull requests
*       - Time between open and close issue
*       - Number of open issues outside a timeframe
*/
function calculateResponsiveness(data: RepositoryData): number {
    const now = new Date();

    // a) Measure time between issues open and close time
    const closedIssues = data.issues.filter(issue => issue.state === 'closed');
    let totalCloseTime = 0;
    closedIssues.forEach(issue => {
        if (issue.closed_at) {
            const openTime = new Date(issue.created_at).getTime();
            const closeTime = new Date(issue.closed_at).getTime();
            totalCloseTime += (closeTime - openTime);
        }
    });
    const averageCloseTime = closedIssues.length > 0 ? totalCloseTime / closedIssues.length : 0;

    // b) Number of open issues older than 30 days
    const openIssuesOlderThan30Days = data.issues.filter(issue => {
        if (issue.state === 'open') {
            const openTime = new Date(issue.created_at).getTime();
            const daysOpen = (now.getTime() - openTime) / (1000 * 3600 * 24);
            return daysOpen > 30;
        }
        return false;
    }).length;

    // Calculate responsiveness score
    let responsiveness = 0;

    if (averageCloseTime > 7 * 24 * 3600 * 1000) {
        responsiveness = responsiveness + 0.5;
    }
    else if (averageCloseTime > 30 * 24 * 3600 * 1000) {
        responsiveness = responsiveness + 0.25;
    }

    if(openIssuesOlderThan30Days < 1) {
        responsiveness = responsiveness + 0.5;
    }
    else if(openIssuesOlderThan30Days < 3) {
        responsiveness = responsiveness + 0.4;
    }
    else if(openIssuesOlderThan30Days < 5) {
        responsiveness = responsiveness + 0.3;
    }
    else if(openIssuesOlderThan30Days < 10) {
        responsiveness = responsiveness + 0.2;
    }
    else if(openIssuesOlderThan30Days < 25) {
        responsiveness = responsiveness + 0.1;
    }

    return responsiveness;
}

/* License Compatibility:
*   - License compatability measures how well the repository's license aligns with project requirements
*   - License Type
*/
function calculateLicenseCompatibility(data: RepositoryData): number {
    const compatibleLicenses = ["LGPL-2.1"];
    return compatibleLicenses.includes(data.license) ? 1 : 0;
}

/* ASSIGN SCORE
*   - Assign a score to each metric based on its value and weight
*/
function calculateFinalScore(metrics: Metrics, weights: Weights): number {
    const totalScore = 
        metrics.busFactor * weights.busFactor +
        metrics.correctness * weights.correctness +
        metrics.rampUpTime * weights.rampUpTime +
        metrics.responsiveness * weights.responsiveness +
        metrics.licenseCompatibility * weights.licenseCompatibility;
    
    const totalWeight = 
        weights.busFactor +
        weights.correctness +
        weights.rampUpTime +
        weights.responsiveness +
        weights.licenseCompatibility;

    return totalScore / totalWeight;
}

// Main Function
async function main(repoUrl: string) {
    const data = await fetchRepositoryData(repoUrl);

    let startTime, endTime, elapsedTime;

    const latencyTimes: LatencyTimes = {
        busFactor: 0,
        correctness: 0,
        rampUpTime: 0,
        responsiveness: 0,
        licenseCompatibility: 0
    };

    startTime = Date.now();
    const busFactor = calculateBusFactor(data);
    endTime = Date.now();
    elapsedTime = (endTime - startTime) / 1000;
    latencyTimes.busFactor = elapsedTime;

    startTime = Date.now();
    const correctness = calculateCorrectness(data);
    endTime = Date.now();
    elapsedTime = (endTime - startTime) / 1000;
    latencyTimes.correctness = elapsedTime;

    startTime = Date.now();
    const rampUpTime = calculateRampUpTime(data);
    endTime = Date.now();
    elapsedTime = (endTime - startTime) / 1000;
    latencyTimes.rampUpTime = elapsedTime;

    startTime = Date.now();
    const responsiveness = calculateResponsiveness(data);
    endTime = Date.now();
    elapsedTime = (endTime - startTime) / 1000;
    latencyTimes.responsiveness = elapsedTime;

    startTime = Date.now();
    const licenseCompatibility = calculateLicenseCompatibility(data);
    endTime = Date.now();
    elapsedTime = (endTime - startTime) / 1000;
    latencyTimes.licenseCompatibility = elapsedTime;

    const metrics: Metrics = {
        busFactor,
        correctness,
        rampUpTime,
        responsiveness,
        licenseCompatibility
    };

    const weights: Weights = {
        busFactor: 0.2,
        correctness: 0.2,
        rampUpTime: 0.2,
        responsiveness: 0.2,
        licenseCompatibility: 0.2
    };
    
    const finalScore = calculateFinalScore(metrics, weights);
    console.log(`Final Score for ${data.name}: ${finalScore}`);
}

// Example usage
main("https://github.com/example/example-repo");