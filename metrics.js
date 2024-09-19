"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_fetch_1 = require("node-fetch");
function fetchRepositoryData(repoUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var token, headers, repoName, repoApiUrl, repoResponse, repoData, issuesResponse, issuesData, contributorsResponse, contributorsData, filesResponse, filesData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = process.env.GITHUB_TOKEN;
                    headers = {
                        'Authorization': "token ".concat(token),
                        'Accept': 'application/vnd.github.v3+json'
                    };
                    repoName = repoUrl.replace('https://github.com/', '');
                    repoApiUrl = "https://api.github.com/repos/".concat(repoName);
                    return [4 /*yield*/, (0, node_fetch_1.default)(repoApiUrl, { headers: headers })];
                case 1:
                    repoResponse = _a.sent();
                    return [4 /*yield*/, repoResponse.json()];
                case 2:
                    repoData = _a.sent();
                    return [4 /*yield*/, (0, node_fetch_1.default)("".concat(repoApiUrl, "/issues?state=all"), { headers: headers })];
                case 3:
                    issuesResponse = _a.sent();
                    return [4 /*yield*/, issuesResponse.json()];
                case 4:
                    issuesData = _a.sent();
                    // Log the issuesData to check its structure
                    console.log('issuesData:', issuesData);
                    if (!Array.isArray(issuesData)) {
                        throw new Error('Expected issuesData to be an array');
                    }
                    return [4 /*yield*/, (0, node_fetch_1.default)("".concat(repoApiUrl, "/contributors"), { headers: headers })];
                case 5:
                    contributorsResponse = _a.sent();
                    return [4 /*yield*/, contributorsResponse.json()];
                case 6:
                    contributorsData = _a.sent();
                    return [4 /*yield*/, (0, node_fetch_1.default)("".concat(repoApiUrl, "/contents"), { headers: headers })];
                case 7:
                    filesResponse = _a.sent();
                    return [4 /*yield*/, filesResponse.json()];
                case 8:
                    filesData = _a.sent();
                    return [2 /*return*/, {
                            name: repoData.name,
                            contributors: contributorsData.length,
                            issues: issuesData.map(function (issue) { return ({
                                state: issue.state,
                                created_at: issue.created_at,
                                closed_at: issue.closed_at,
                                labels: issue.labels ? issue.labels.map(function (label) { return label.name; }) : []
                            }); }),
                            pullRequests: repoData.open_issues_count,
                            lastCommitDate: new Date(repoData.pushed_at),
                            license: repoData.license ? repoData.license.spdx_id : 'No license',
                            files: filesData.map(function (file) { return ({ fileName: file.name }); })
                        }];
            }
        });
    });
}
// CALCULATE METRICS
/* Bus Factor:
*   - Bus factor is a measure of how many contributors are critical to a project
*       - Number of contributors
*/
function calculateBusFactor(data) {
    var busFactor = 0;
    for (var i = 1; i <= data.contributors; i++) {
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
function calculateCorrectness(data) {
    var correctness = 0;
    // number of open bugs
    var openBugIssues = data.issues.filter(function (issue) { return issue.state === 'open' && issue.labels && issue.labels.includes('bug'); }).length;
    // open/closed issue ratio
    var openIssues = data.issues.filter(function (issue) { return issue.state === 'open'; }).length;
    var closedIssues = data.issues.filter(function (issue) { return issue.state === 'closed'; }).length;
    var issueRatio = closedIssues > 0 ? openIssues / closedIssues : openIssues;
    if (issueRatio == 0) {
        correctness = 1;
    }
    else if (issueRatio < 0.25) {
        correctness = 0.8;
    }
    else if (issueRatio < 0.5) {
        correctness = 0.6;
    }
    else if (issueRatio < 1) {
        correctness = 0.4;
    }
    else if (issueRatio > 1) {
        correctness = 0.2;
    }
    correctness = correctness * 1 / (Math.pow(1.15, openBugIssues));
    return correctness;
}
/* Ramp Up Time:
*   - Ramp up time is a measure of how much time is required for a new developer to become productive
*       - Presence of documentation (e.g. README)
*       - Size of codebase
*/
function calculateRampUpTime(data) {
    var rampUpTimeScore = 0;
    // Check for the presence of a README file
    var hasReadme = data.files.some(function (file) { return file.fileName.toLowerCase() === 'readme.md' || file.fileName.toLowerCase() === 'readme'; });
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
function calculateResponsiveness(data) {
    var now = new Date();
    // a) Measure time between issues open and close time
    var closedIssues = data.issues.filter(function (issue) { return issue.state === 'closed'; });
    var totalCloseTime = 0;
    closedIssues.forEach(function (issue) {
        if (issue.closed_at) {
            var openTime = new Date(issue.created_at).getTime();
            var closeTime = new Date(issue.closed_at).getTime();
            totalCloseTime += (closeTime - openTime);
        }
    });
    var averageCloseTime = closedIssues.length > 0 ? totalCloseTime / closedIssues.length : 0;
    // b) Number of open issues older than 30 days
    var openIssuesOlderThan30Days = data.issues.filter(function (issue) {
        if (issue.state === 'open') {
            var openTime = new Date(issue.created_at).getTime();
            var daysOpen = (now.getTime() - openTime) / (1000 * 3600 * 24);
            return daysOpen > 30;
        }
        return false;
    }).length;
    // Calculate responsiveness score
    var responsiveness = 0;
    if (averageCloseTime > 7 * 24 * 3600 * 1000) {
        responsiveness = responsiveness + 0.5;
    }
    else if (averageCloseTime > 30 * 24 * 3600 * 1000) {
        responsiveness = responsiveness + 0.25;
    }
    if (openIssuesOlderThan30Days < 1) {
        responsiveness = responsiveness + 0.5;
    }
    else if (openIssuesOlderThan30Days < 3) {
        responsiveness = responsiveness + 0.4;
    }
    else if (openIssuesOlderThan30Days < 5) {
        responsiveness = responsiveness + 0.3;
    }
    else if (openIssuesOlderThan30Days < 10) {
        responsiveness = responsiveness + 0.2;
    }
    else if (openIssuesOlderThan30Days < 25) {
        responsiveness = responsiveness + 0.1;
    }
    return responsiveness;
}
/* License Compatibility:
*   - License compatability measures how well the repository's license aligns with project requirements
*   - License Type
*/
function calculateLicenseCompatibility(data) {
    var compatibleLicenses = ["LGPL-2.1"];
    return compatibleLicenses.includes(data.license) ? 1 : 0;
}
/* ASSIGN SCORE
*   - Assign a score to each metric based on its value and weight
*/
function calculateFinalScore(metrics, weights) {
    var totalScore = metrics.busFactor * weights.busFactor +
        metrics.correctness * weights.correctness +
        metrics.rampUpTime * weights.rampUpTime +
        metrics.responsiveness * weights.responsiveness +
        metrics.licenseCompatibility * weights.licenseCompatibility;
    var totalWeight = weights.busFactor +
        weights.correctness +
        weights.rampUpTime +
        weights.responsiveness +
        weights.licenseCompatibility;
    return totalScore / totalWeight;
}
// Main Function
function calculateMetrics(repoUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var data, startTime, endTime, elapsedTime, latencyTimes, busFactor, correctness, rampUpTime, responsiveness, licenseCompatibility, metrics, weights, finalScore;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchRepositoryData(repoUrl)];
                case 1:
                    data = _a.sent();
                    latencyTimes = {
                        busFactor: 0,
                        correctness: 0,
                        rampUpTime: 0,
                        responsiveness: 0,
                        licenseCompatibility: 0
                    };
                    startTime = Date.now();
                    busFactor = calculateBusFactor(data);
                    endTime = Date.now();
                    elapsedTime = (endTime - startTime) / 1000;
                    latencyTimes.busFactor = elapsedTime;
                    startTime = Date.now();
                    correctness = calculateCorrectness(data);
                    endTime = Date.now();
                    elapsedTime = (endTime - startTime) / 1000;
                    latencyTimes.correctness = elapsedTime;
                    startTime = Date.now();
                    rampUpTime = calculateRampUpTime(data);
                    endTime = Date.now();
                    elapsedTime = (endTime - startTime) / 1000;
                    latencyTimes.rampUpTime = elapsedTime;
                    startTime = Date.now();
                    responsiveness = calculateResponsiveness(data);
                    endTime = Date.now();
                    elapsedTime = (endTime - startTime) / 1000;
                    latencyTimes.responsiveness = elapsedTime;
                    startTime = Date.now();
                    licenseCompatibility = calculateLicenseCompatibility(data);
                    endTime = Date.now();
                    elapsedTime = (endTime - startTime) / 1000;
                    latencyTimes.licenseCompatibility = elapsedTime;
                    metrics = {
                        busFactor: busFactor,
                        correctness: correctness,
                        rampUpTime: rampUpTime,
                        responsiveness: responsiveness,
                        licenseCompatibility: licenseCompatibility
                    };
                    weights = {
                        busFactor: 0.2,
                        correctness: 0.2,
                        rampUpTime: 0.2,
                        responsiveness: 0.2,
                        licenseCompatibility: 0.2
                    };
                    finalScore = calculateFinalScore(metrics, weights);
                    console.log("Final Score for ".concat(data.name, ": ").concat(finalScore));
                    console.log("Latency Times: ".concat(JSON.stringify(latencyTimes)));
                    return [2 /*return*/];
            }
        });
    });
}
// Example usage
//main("https://github.com/ece362-purdue/lab3-timers-IanKarlmann");
calculateMetrics("https://github.com/Gokul-H7/Group27_461_Project");
