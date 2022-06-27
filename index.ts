type Gamemode = 'soloq' | 'swf' | 'killer';
const MATCHES = 'dbd-minimal-tracker-matches';
class Match {
    timestamp!: number;
    kills!: number;
    // Only applicable if survivor
    survived!: boolean;
    // Only applicable if SWF
    teamSize: number | undefined;
    gamemode!: Gamemode;
}

let matches: Match[];
if (localStorage.getItem(MATCHES)) {
    matches = JSON.parse(localStorage.getItem(MATCHES)!);
} else {
    matches = [];
}

function addMatch(type: Gamemode) {
    const match = new Match();
    match.timestamp = Date.now();
    match.kills = +(document.getElementById('killnumber') as HTMLInputElement).value;
    match.teamSize = +(document.getElementById('killnumber') as HTMLInputElement).value;
    match.survived = (document.getElementById('survive') as HTMLInputElement).checked;
    match.gamemode = type;
    matches.push(match);
    localStorage.setItem(MATCHES, JSON.stringify(matches));
    printStats();
}

function addSoloMatch() {
    addMatch('soloq');
}

function addSwfMatch() {
    addMatch('swf');
}

function addKillerMatch() {
    addMatch('killer');
}


function printStats() {
    printSurvKillerSplit();
    printTotalEscapeRate();
    printKillRate();
}

function printSurvKillerSplit() {
    const allMatches = getAllMatches().length;
    const survMatches = getSurvMatches().length;
    const killerMatches = allMatches - survMatches;
    const survPercentage = (survMatches * 100 / allMatches).toFixed(0);
    const killerPercentage = (killerMatches * 100 / allMatches).toFixed(0);
    document.getElementById('surv-kill-split')!.textContent = survPercentage + '/' + killerPercentage;
}

function printTotalEscapeRate() {
    const survMatches = getSurvMatches();
    const matches = getAllMatches();
    // general
    const totalEscapes = matches.reduce((total, item) => 4 - item.kills + total, 0);
    document.getElementById('escape-general')!.textContent = ((totalEscapes * 100) / (4 * matches.length)).toFixed(0) + '%';
    // Mine
    const myEscapes = survMatches.filter(item => item.survived).length;
    document.getElementById('escape-you')!.textContent = (myEscapes * 100 / survMatches.length).toFixed(0) + '%';
    // Others
    // const othersEscapesWithMeInTheGame = matches.reduce((total, item) => 3 - item.kills + (item.survived ? 0 : -1) + total, 0);

    // document.getElementById('escape-you')!.textContent = (myEscapes * 100 / survMatches.length).toFixed(0) + '%';
}

function printKillRate() {
    const killerMatches = getKillerMatches();
    const survMatches = getSurvMatches();
    const matches = getAllMatches();
    // general
    const totalKills = matches.reduce((total, item) => item.kills + total, 0);
    document.getElementById('kill-general')!.textContent = ((totalKills * 100) / (4 * matches.length)).toFixed(0) + '%';
    // Mine
    const myKills = killerMatches.reduce((total, item) => item.kills + total, 0);
    document.getElementById('kill-you')!.textContent = (myKills * 100 / (4 * killerMatches.length)).toFixed(0) + '%';
    // Mine
    const otherKills = survMatches.reduce((total, item) => item.kills + total, 0);
    document.getElementById('kill-others')!.textContent = (otherKills * 100 / (4 * survMatches.length)).toFixed(0) + '%';
}

function getAllMatches() {
    return matches;
}

function getSurvMatches() {
    return getAllMatches().filter(match => match.gamemode !== 'killer');
}

function getKillerMatches() {
    return getAllMatches().filter(match => match.gamemode === 'killer');
}
