const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const replacements = [
  { regex: /text-\[clamp\(10px,2\.5vw,12px\)\]/g, replace: 'text-[clamp(12px,3vw,14px)]' },
  { regex: /text-\[clamp\(12px,3vw,14px\)\]/g, replace: 'text-[clamp(14px,3.5vw,16px)]' },
  { regex: /text-\[clamp\(14px,3\.5vw,16px\)\]/g, replace: 'text-[clamp(16px,4vw,18px)]' },
  { regex: /text-\[clamp\(14px,4vw,18px\)\]/g, replace: 'text-[clamp(18px,4.5vw,20px)]' },
  { regex: /text-\[clamp\(16px,4\.5vw,20px\)\]/g, replace: 'text-[clamp(20px,5vw,24px)]' },
  { regex: /text-\[clamp\(18px,5vw,24px\)\]/g, replace: 'text-[clamp(22px,5.5vw,28px)]' },
  { regex: /text-\[clamp\(20px,6vw,30px\)\]/g, replace: 'text-[clamp(24px,6vw,32px)]' },
  { regex: /text-\[clamp\(24px,7vw,36px\)\]/g, replace: 'text-[clamp(28px,7vw,40px)]' },
  { regex: /text-\[clamp\(28px,8vw,48px\)\]/g, replace: 'text-[clamp(32px,8vw,48px)]' },
];

replacements.forEach(({ regex, replace }) => {
  content = content.replace(regex, replace);
});

fs.writeFileSync('src/App.tsx', content);
console.log('Replacements 4 done.');
