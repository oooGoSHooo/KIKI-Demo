const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const replacements = [
  // Widths/Heights
  { regex: /\bw-12\b/g, replace: 'w-[clamp(36px,10vw,48px)]' },
  { regex: /\bh-12\b/g, replace: 'h-[clamp(36px,10vw,48px)]' },
  { regex: /\bw-14\b/g, replace: 'w-[clamp(40px,12vw,56px)]' },
  { regex: /\bh-14\b/g, replace: 'h-[clamp(40px,12vw,56px)]' },
  { regex: /\bw-16\b/g, replace: 'w-[clamp(48px,14vw,64px)]' },
  { regex: /\bh-16\b/g, replace: 'h-[clamp(48px,14vw,64px)]' },
  { regex: /\bw-24\b/g, replace: 'w-[clamp(64px,20vw,96px)]' },
  { regex: /\bh-24\b/g, replace: 'h-[clamp(64px,20vw,96px)]' },
  { regex: /\bw-28\b/g, replace: 'w-[clamp(80px,25vw,112px)]' },
  { regex: /\bh-28\b/g, replace: 'h-[clamp(80px,25vw,112px)]' },
  { regex: /\bw-32\b/g, replace: 'w-[clamp(96px,30vw,128px)]' },
  { regex: /\bh-32\b/g, replace: 'h-[clamp(96px,30vw,128px)]' },
  
  // Padding
  { regex: /\bp-4\b/g, replace: 'p-[clamp(12px,3vw,16px)]' },
  { regex: /\bp-5\b/g, replace: 'p-[clamp(14px,3.5vw,20px)]' },
  { regex: /\bp-6\b/g, replace: 'p-[clamp(16px,4vw,24px)]' },
  { regex: /\bp-8\b/g, replace: 'p-[clamp(20px,5vw,32px)]' },
  { regex: /\bp-10\b/g, replace: 'p-[clamp(24px,6vw,40px)]' },
  { regex: /\bpx-4\b/g, replace: 'px-[clamp(12px,3vw,16px)]' },
  { regex: /\bpx-6\b/g, replace: 'px-[clamp(16px,4vw,24px)]' },
  { regex: /\bpx-8\b/g, replace: 'px-[clamp(20px,5vw,32px)]' },
  { regex: /\bpy-4\b/g, replace: 'py-[clamp(12px,3vw,16px)]' },
  { regex: /\bpy-6\b/g, replace: 'py-[clamp(16px,4vw,24px)]' },
  { regex: /\bpy-8\b/g, replace: 'py-[clamp(20px,5vw,32px)]' },
  
  // Margins
  { regex: /\bmb-4\b/g, replace: 'mb-[clamp(12px,3vw,16px)]' },
  { regex: /\bmb-6\b/g, replace: 'mb-[clamp(16px,4vw,24px)]' },
  { regex: /\bmb-8\b/g, replace: 'mb-[clamp(20px,5vw,32px)]' },
  { regex: /\bmt-4\b/g, replace: 'mt-[clamp(12px,3vw,16px)]' },
  { regex: /\bmt-6\b/g, replace: 'mt-[clamp(16px,4vw,24px)]' },
  { regex: /\bmt-8\b/g, replace: 'mt-[clamp(20px,5vw,32px)]' },
  
  // Gaps & Spacing
  { regex: /\bgap-4\b/g, replace: 'gap-[clamp(12px,3vw,16px)]' },
  { regex: /\bgap-6\b/g, replace: 'gap-[clamp(16px,4vw,24px)]' },
  { regex: /\bgap-8\b/g, replace: 'gap-[clamp(20px,5vw,32px)]' },
  { regex: /\bspace-x-4\b/g, replace: 'space-x-[clamp(12px,3vw,16px)]' },
  { regex: /\bspace-x-6\b/g, replace: 'space-x-[clamp(16px,4vw,24px)]' },
  { regex: /\bspace-y-4\b/g, replace: 'space-y-[clamp(12px,3vw,16px)]' },
  { regex: /\bspace-y-6\b/g, replace: 'space-y-[clamp(16px,4vw,24px)]' },
  
  // Typography
  { regex: /\btext-xs\b/g, replace: 'text-[clamp(10px,2.5vw,12px)]' },
  { regex: /\btext-sm\b/g, replace: 'text-[clamp(12px,3vw,14px)]' },
  { regex: /\btext-base\b/g, replace: 'text-[clamp(14px,3.5vw,16px)]' },
  { regex: /\btext-lg\b/g, replace: 'text-[clamp(14px,4vw,18px)]' },
  { regex: /\btext-xl\b/g, replace: 'text-[clamp(16px,4.5vw,20px)]' },
  { regex: /\btext-2xl\b/g, replace: 'text-[clamp(18px,5vw,24px)]' },
  { regex: /\btext-3xl\b/g, replace: 'text-[clamp(20px,6vw,30px)]' },
  { regex: /\btext-4xl\b/g, replace: 'text-[clamp(24px,7vw,36px)]' },
  { regex: /\btext-5xl\b/g, replace: 'text-[clamp(28px,8vw,48px)]' },
  
  // Border Radius
  { regex: /\brounded-2xl\b/g, replace: 'rounded-[clamp(12px,3vw,16px)]' },
  { regex: /\brounded-3xl\b/g, replace: 'rounded-[clamp(16px,4vw,24px)]' },
  { regex: /\brounded-\[40px\]\b/g, replace: 'rounded-[clamp(24px,6vw,40px)]' },
  { regex: /\brounded-\[24px\]\b/g, replace: 'rounded-[clamp(16px,4vw,24px)]' },
];

replacements.forEach(({ regex, replace }) => {
  content = content.replace(regex, replace);
});

fs.writeFileSync('src/App.tsx', content);
console.log('Replacements done.');
