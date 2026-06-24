const fs = require('fs');
const path = require('path');
const https = require('https');

const componentsDir = path.join(__dirname, 'src', 'components', 'tools');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.jsx'));

async function checkUrl(url, file) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200 && res.statusCode !== 302) {
        console.log(`Failed (${res.statusCode}): ${file} -> ${url}`);
      } else {
        console.log(`OK (${res.statusCode}): ${file}`);
      }
      resolve();
    }).on('error', (err) => {
      console.log(`Error: ${file} -> ${err.message}`);
      resolve();
    });
  });
}

async function run() {
  for (const file of files) {
    const content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
    const match = content.match(/backgroundImage: 'url\("([^"]+)"\)'/);
    if (match) {
      await checkUrl(match[1], file);
    }
  }
}
run();
