const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
  '<Lock className="text-white drop-shadow-md" size={32} />',
  '<div className="bg-black/75 rounded-full p-[clamp(8px,2vw,12px)] flex items-center justify-center"><Lock className="text-white drop-shadow-md" size={28} /></div>'
);
fs.writeFileSync('src/App.tsx', content);
console.log('Replaced');
