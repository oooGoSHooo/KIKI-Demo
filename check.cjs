const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const wMatches = content.match(/\bw-[0-9]+\b/g) || [];
const hMatches = content.match(/\bh-[0-9]+\b/g) || [];
console.log('w:', [...new Set(wMatches)]);
console.log('h:', [...new Set(hMatches)]);
