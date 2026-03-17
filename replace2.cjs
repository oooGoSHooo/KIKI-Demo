const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const replacements = [
  // Widths/Heights
  { regex: /\bw-8\b/g, replace: 'w-[clamp(24px,6vw,32px)]' },
  { regex: /\bh-8\b/g, replace: 'h-[clamp(24px,6vw,32px)]' },
  { regex: /\bw-10\b/g, replace: 'w-[clamp(32px,8vw,40px)]' },
  { regex: /\bh-10\b/g, replace: 'h-[clamp(32px,8vw,40px)]' },
  { regex: /\bw-20\b/g, replace: 'w-[clamp(56px,16vw,80px)]' },
  { regex: /\bh-20\b/g, replace: 'h-[clamp(56px,16vw,80px)]' },
  { regex: /\bw-40\b/g, replace: 'w-[clamp(112px,35vw,160px)]' },
  { regex: /\bh-40\b/g, replace: 'h-[clamp(112px,35vw,160px)]' },
  { regex: /\bw-48\b/g, replace: 'w-[clamp(128px,40vw,192px)]' },
  { regex: /\bh-48\b/g, replace: 'h-[clamp(128px,40vw,192px)]' },
  { regex: /\bw-64\b/g, replace: 'w-[clamp(160px,50vw,256px)]' },
  { regex: /\bh-64\b/g, replace: 'h-[clamp(160px,50vw,256px)]' },
  
  // Padding
  { regex: /\bp-2\b/g, replace: 'p-[clamp(6px,2vw,8px)]' },
  { regex: /\bp-3\b/g, replace: 'p-[clamp(8px,2.5vw,12px)]' },
  { regex: /\bpx-2\b/g, replace: 'px-[clamp(6px,2vw,8px)]' },
  { regex: /\bpx-3\b/g, replace: 'px-[clamp(8px,2.5vw,12px)]' },
  { regex: /\bpx-5\b/g, replace: 'px-[clamp(14px,3.5vw,20px)]' },
  { regex: /\bpx-10\b/g, replace: 'px-[clamp(24px,6vw,40px)]' },
  { regex: /\bpx-14\b/g, replace: 'px-[clamp(32px,8vw,56px)]' },
  { regex: /\bpy-2\b/g, replace: 'py-[clamp(6px,2vw,8px)]' },
  { regex: /\bpy-2\.5\b/g, replace: 'py-[clamp(8px,2.5vw,10px)]' },
  { regex: /\bpy-3\b/g, replace: 'py-[clamp(8px,2.5vw,12px)]' },
  { regex: /\bpy-5\b/g, replace: 'py-[clamp(14px,3.5vw,20px)]' },
  { regex: /\bpy-10\b/g, replace: 'py-[clamp(24px,6vw,40px)]' },
  
  // Margins
  { regex: /\bmb-2\b/g, replace: 'mb-[clamp(6px,2vw,8px)]' },
  { regex: /\bmb-3\b/g, replace: 'mb-[clamp(8px,2.5vw,12px)]' },
  { regex: /\bmt-2\b/g, replace: 'mt-[clamp(6px,2vw,8px)]' },
  { regex: /\bmt-3\b/g, replace: 'mt-[clamp(8px,2.5vw,12px)]' },
  
  // Gaps & Spacing
  { regex: /\bgap-2\b/g, replace: 'gap-[clamp(6px,2vw,8px)]' },
  { regex: /\bgap-3\b/g, replace: 'gap-[clamp(8px,2.5vw,12px)]' },
  { regex: /\bgap-5\b/g, replace: 'gap-[clamp(14px,3.5vw,20px)]' },
  { regex: /\bspace-x-2\b/g, replace: 'space-x-[clamp(6px,2vw,8px)]' },
  { regex: /\bspace-x-3\b/g, replace: 'space-x-[clamp(8px,2.5vw,12px)]' },
  { regex: /\bspace-x-5\b/g, replace: 'space-x-[clamp(14px,3.5vw,20px)]' },
  { regex: /\bspace-y-2\b/g, replace: 'space-y-[clamp(6px,2vw,8px)]' },
  { regex: /\bspace-y-3\b/g, replace: 'space-y-[clamp(8px,2.5vw,12px)]' },
  { regex: /\bspace-y-5\b/g, replace: 'space-y-[clamp(14px,3.5vw,20px)]' },
  
  // Border Radius
  { regex: /\brounded-xl\b/g, replace: 'rounded-[clamp(8px,2vw,12px)]' },
  { regex: /\brounded-lg\b/g, replace: 'rounded-[clamp(6px,1.5vw,8px)]' },
];

replacements.forEach(({ regex, replace }) => {
  content = content.replace(regex, replace);
});

fs.writeFileSync('src/App.tsx', content);
console.log('Replacements 2 done.');
