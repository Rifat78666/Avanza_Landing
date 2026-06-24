const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components', 'tools');

const tools = [
  {
    file: 'USCreditsCalculator.jsx',
    title: 'U.S. Credits Calculator',
    subtitle: 'Convert foreign credits to U.S. Semester Hours.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1920&q=80'
  },
  {
    file: 'KSACreditsCalculator.jsx',
    title: 'KSA Credits Calculator',
    subtitle: 'Convert credits to Saudi Arabian standards.',
    image: 'https://images.unsplash.com/photo-1586724237569-f3a0c1dee8c6?auto=format&fit=crop&w=1920&q=80'
  },
  {
    file: 'DegreeLevelChecker.jsx',
    title: 'Degree Level Checker',
    subtitle: 'Map foreign degrees to Italian Laurea levels.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80'
  },
  {
    file: 'AlboCheck.jsx',
    title: 'Albo Check',
    subtitle: 'Check if your profession is regulated in Italy.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1920&q=80'
  },
  {
    file: 'UniversityRequirements.jsx',
    title: 'University Requirements',
    subtitle: 'Find entry requirements by country.',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1920&q=80'
  },
  {
    file: 'CredentialReport.jsx',
    title: 'Official Credential Report',
    subtitle: 'Generate an official PDF translating your foreign academic credentials into European standards.',
    image: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=1920&q=80'
  },
  {
    file: 'WorkPermitWizard.jsx',
    title: 'Work Permit Wizard',
    subtitle: 'Find the exact Italian residence permit you need.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1920&q=80'
  },
  {
    file: 'DecretoFlussiChecker.jsx',
    title: 'Decreto Flussi Checker',
    subtitle: 'Check eligibility for Italian immigration quotas.',
    image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=1920&q=80'
  },
  {
    file: 'UniversityRankings.jsx',
    title: 'University Rankings',
    subtitle: 'Search global university rankings.',
    image: 'https://images.unsplash.com/photo-1523580494112-071d311b95b8?auto=format&fit=crop&w=1920&q=80'
  },
  {
    file: 'CIPCodes.jsx',
    title: 'CIP Codes Search',
    subtitle: 'Search Classification of Instructional Programs.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=80'
  }
];

for (const tool of tools) {
  const filePath = path.join(componentsDir, tool.file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${tool.file}`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('backgroundImage: \'url(')) {
    console.log(`Skipping ${tool.file}, looks like it already has a hero banner.`);
    continue;
  }

  const heroBanner = `    <>
      <div style={{
        width: '100%',
        position: 'relative',
        backgroundImage: 'url("${tool.image}")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '5rem 1rem',
        textAlign: 'center',
        color: 'white',
        borderBottom: '4px solid #009246'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 40, 20, 0.7)',
          zIndex: 1
        }}></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>${tool.title}</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>${tool.subtitle}</p>
        </div>
      </div>
`;

  // Insert hero banner after `return (`
  // Wait, `return (` might be followed by a newline and spaces and `<div`
  const returnIndex = content.indexOf('return (');
  if (returnIndex === -1) {
      console.log(`Could not find "return (" in ${tool.file}`);
      continue;
  }
  
  // Find the first "<div" or "<" after "return ("
  const bracketIndex = content.indexOf('<', returnIndex);
  
  if (bracketIndex !== -1) {
      content = content.slice(0, bracketIndex) + heroBanner + content.slice(bracketIndex);
  }
  
  // Now add `</>` right before the final `);` of the return statement
  // To do this, find the last `);` in the file.
  const lastParenIndex = content.lastIndexOf(');');
  if (lastParenIndex !== -1) {
      content = content.slice(0, lastParenIndex) + '    </>\n  ' + content.slice(lastParenIndex);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${tool.file}`);
}
