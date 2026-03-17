const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/text-\[clamp\(16px,4vw,18px\)\]/g, 'text-[clamp(14px,3.5vw,16px)]');

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed cascaded text sizes.');
