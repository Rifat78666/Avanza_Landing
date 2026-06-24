const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components', 'tools');

const gradients = {
  'DegreeLevelChecker.jsx': 'linear-gradient(135deg, rgba(30, 60, 114, 0.8) 0%, rgba(42, 82, 152, 0.8) 100%)',
  'AlboCheck.jsx': 'linear-gradient(135deg, rgba(44, 62, 80, 0.8) 0%, rgba(52, 152, 219, 0.8) 100%)',
  'UniversityRequirements.jsx': 'linear-gradient(135deg, rgba(20, 30, 48, 0.8) 0%, rgba(36, 59, 85, 0.8) 100%)',
  'CredentialReport.jsx': 'linear-gradient(135deg, rgba(169, 50, 38, 0.8) 0%, rgba(146, 43, 33, 0.8) 100%)',
  'WorkPermitWizard.jsx': 'linear-gradient(135deg, rgba(0, 146, 70, 0.8) 0%, rgba(20, 100, 60, 0.8) 100%)',
  'DecretoFlussiChecker.jsx': 'linear-gradient(135deg, rgba(236, 112, 99, 0.8) 0%, rgba(136, 78, 160, 0.8) 100%)',
  'UniversityRankings.jsx': 'linear-gradient(135deg, rgba(243, 156, 18, 0.8) 0%, rgba(211, 84, 0, 0.8) 100%)',
  'CIPCodes.jsx': 'linear-gradient(135deg, rgba(22, 160, 133, 0.8) 0%, rgba(41, 128, 185, 0.8) 100%)'
};

for (const [file, gradient] of Object.entries(gradients)) {
  const filePath = path.join(componentsDir, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the exact old string: backgroundColor: 'rgba(0, 40, 20, 0.7)'
  // with background: 'linear-gradient(...)'
  content = content.replace(
    /backgroundColor:\s*'rgba\(0,\s*40,\s*20,\s*0\.7\)'/,
    `background: '${gradient}'`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}
