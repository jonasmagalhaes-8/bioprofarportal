const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      filelist.push(dirFile);
    }
  });
  return filelist;
}

const files = walkSync('src/app/controllers');
for (const file of files) {
  if (!file.endsWith('.ts')) continue;
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace standard put('/endpoint/atualizar', var)
  content = content.replace(/const\s+json\s*=\s*await\s+apiBackend\.put\('(\/[a-z]+)\/atualizar',\s*([a-zA-Z0-9_]+)\);/g, (match, endpoint, variable) => {
    return `let json;\n    if (${variable}.id) {\n      json = await apiBackend.put('${endpoint}/atualizar', ${variable});\n    } else {\n      json = await apiBackend.post('${endpoint}/salvar', ${variable});\n    }`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
