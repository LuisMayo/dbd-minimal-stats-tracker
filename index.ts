type Gamemode = 'soloq' | 'swf' | 'killer';
const MATCHES = 'dbd-minimal-tracker-matches';
class Match {
    timestamp!: number;
    kills!: number;
    survived!: boolean;
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
    match.survived = (document.getElementById('survive') as HTMLInputElement).checked;
    match.gamemode = type;
    matches.push(match);
    localStorage.setItem(MATCHES, JSON.stringify(matches));
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
