const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const files = walk(srcDir);

files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace 'http://localhost:5001/api...' with `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}...`
  // We need to account for both backticks and single quotes.

  // Case 1: single quotes: 'http://localhost:5001/api/something'
  content = content.replace(/'http:\/\/localhost:5001\/api([^']*)'/g, "`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}$1`");

  // Case 2: backticks: `http://localhost:5001/api/${id}`
  content = content.replace(/`http:\/\/localhost:5001\/api([^`]*)`/g, "`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}$1`");

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated port links: ${path.relative(__dirname, file)}`);
  }
});
