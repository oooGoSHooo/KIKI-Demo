const fs = require('fs');
const path = require('path');

function removeHover(file) {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace all hover:xxx and group-hover:xxx classes
  content = content.replace(/\bhover:[a-zA-Z0-9\-\/]*\b/g, '');
  content = content.replace(/\bgroup-hover:[a-zA-Z0-9\-\/]*\b/g, '');

  // Clean up any double spaces left behind
  content = content.replace(/  +/g, ' ');

  fs.writeFileSync(filePath, content);
  console.log(`Done replacing hover classes in ${file}`);
}

removeHover('src/App.tsx');
removeHover('src/components/EbookReader.tsx');
