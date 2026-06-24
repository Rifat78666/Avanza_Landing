const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components', 'tools');

const fixes = {
  'DegreeLevelChecker.jsx': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1920&q=80',
  'UniversityRankings.jsx': 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1920&q=80',
  'KSACreditsCalculator.jsx': 'https://images.unsplash.com/photo-1551041777-ed277b8dd348?auto=format&fit=crop&w=1920&q=80'
};

for (const [file, newUrl] of Object.entries(fixes)) {
  const filePath = path.join(componentsDir, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/backgroundImage: 'url\("([^"]+)"\)'/, `backgroundImage: 'url("${newUrl}")'`);
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed URL in ${file}`);
}
