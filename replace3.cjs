const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const replacements = [
  { regex: /\bw-56\b/g, replace: 'w-[clamp(160px,50vw,224px)]' },
  { regex: /\bh-56\b/g, replace: 'h-[clamp(160px,50vw,224px)]' },
  { regex: /\bw-72\b/g, replace: 'w-[clamp(200px,60vw,288px)]' },
  { regex: /\bh-72\b/g, replace: 'h-[clamp(200px,60vw,288px)]' },
  { regex: /\bw-80\b/g, replace: 'w-[clamp(240px,70vw,320px)]' },
  { regex: /\bh-80\b/g, replace: 'h-[clamp(240px,70vw,320px)]' },
  { regex: /\bw-96\b/g, replace: 'w-[clamp(280px,80vw,384px)]' },
  { regex: /\bh-96\b/g, replace: 'h-[clamp(280px,80vw,384px)]' },
  
  // Also check padding/margin/gap
  { regex: /\bp-12\b/g, replace: 'p-[clamp(32px,8vw,48px)]' },
  { regex: /\bpx-12\b/g, replace: 'px-[clamp(32px,8vw,48px)]' },
  { regex: /\bpy-12\b/g, replace: 'py-[clamp(32px,8vw,48px)]' },
  { regex: /\bgap-12\b/g, replace: 'gap-[clamp(32px,8vw,48px)]' },
  { regex: /\bspace-x-12\b/g, replace: 'space-x-[clamp(32px,8vw,48px)]' },
  { regex: /\bspace-y-12\b/g, replace: 'space-y-[clamp(32px,8vw,48px)]' },
];

replacements.forEach(({ regex, replace }) => {
  content = content.replace(regex, replace);
});

fs.writeFileSync('src/App.tsx', content);
console.log('Replacements 3 done.');
