const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components', 'tools');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const regex = /\s*<div style={{ marginTop: '1\.5rem', paddingTop: '1\.5rem', borderTop: '1px solid var\(--border-color\)', textAlign: 'center' }}>[\s\S]*?window\.location\.href = '\/quiz'[\s\S]*?<\/button>\s*<\/div>/g;
  
  if (regex.test(content)) {
    content = content.replace(regex, '');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Removed CTA from ${file}`);
  }
}
