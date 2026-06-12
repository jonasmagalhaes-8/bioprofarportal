const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      if (fs.statSync(dirFile).isDirectory()) {
        filelist = walkSync(dirFile, filelist);
      } else {
        filelist.push(dirFile);
      }
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') filelist.push(dirFile);
    }
  });
  return filelist;
}

const allFiles = walkSync('src/app');
for (const file of allFiles) {
    if (!file.endsWith('.ts') && !file.endsWith('.tsx')) continue;
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    content = content.replace(/id:\s*string\s*=\s*['"]['"];/g, 'id?: number;');
    content = content.replace(/\.id\s*=\s*['"](\d+)['"]/g, '.id = $1');
    content = content.replace(/\.id\s*=\s*String\(Date\.now\(\)\)/g, '.id = Date.now()');
    content = content.replace(/\.id\s*=\s*\([^)]+\)\.toString\(\)/g, '.id = mockMembros.length + 1');
    content = content.replace(/=== ['"](\d+)['"]/g, '=== $1');

    if (content !== originalContent) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
}
