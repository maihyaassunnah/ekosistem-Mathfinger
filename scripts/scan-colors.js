const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, '..', 'src', 'components'),
  path.join(__dirname, '..', 'src', 'app'),
  path.join(__dirname, '..', 'src', 'lib')
];

function getAllFiles(dir, exts = ['.tsx', '.ts', '.css']) {
  let files = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, exts));
    } else if (exts.includes(path.extname(fullPath))) {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = targetDirs.flatMap(d => fs.existsSync(d) ? getAllFiles(d) : []);
console.log(`Scanning ${allFiles.length} files...`);

let totalBlueMatches = 0;
const fileStats = [];

for (const f of allFiles) {
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.match(/blue-[0-9]{2,3}/g);
  if (matches) {
    totalBlueMatches += matches.length;
    fileStats.push({ file: path.relative(path.join(__dirname, '..'), f), count: matches.length });
  }
}

console.log(`Total blue-XXX occurrences: ${totalBlueMatches}`);
console.log(fileStats);
