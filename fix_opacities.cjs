const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components', 'tools');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace 0.8 and 0.6 opacity in linear-gradient with 0.3 to make the image visible
  // It looks like: background: 'linear-gradient(135deg, rgba(0, 146, 70, 0.8) 0%, rgba(206, 43, 55, 0.6) 100%)',
  
  content = content.replace(/rgba\((\d+,\s*\d+,\s*\d+),\s*0\.[68]\)/g, 'rgba($1, 0.4)');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated opacities in ${file}`);
}
