const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components', 'tools');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // This regex matches a div that contains a paragraph starting with "Need an official" 
  // and a button containing "Get Your Recognition Roadmap"
  const regex = /\s*<div[^>]*>\s*<p[^>]*>Need an official[^<]*<\/p>\s*<button[^>]*>[\s\S]*?Get Your Recognition Roadmap[\s\S]*?<\/button>\s*<\/div>/gi;
  
  if (regex.test(content)) {
    content = content.replace(regex, '');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Removed roadmap block from ${file}`);
  }
}
