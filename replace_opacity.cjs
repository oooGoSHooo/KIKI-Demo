const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
  '<div className="bg-black/75 rounded-full p-[clamp(8px,2vw,12px)] flex items-center justify-center"><Lock className="text-white drop-shadow-md" size={28} /></div>',
  '<div className="bg-black/50 rounded-full p-[clamp(8px,2vw,12px)] flex items-center justify-center"><Lock className="text-white drop-shadow-md" size={28} /></div>'
);
fs.writeFileSync('src/App.tsx', content);
console.log('Replaced');
