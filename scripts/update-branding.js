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
      if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
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

  // Replace Nav container heights
  content = content.replace(/className="[^"]*h-20[^"]*flex items-center justify-between[^"]*"/g, (match) => {
    return match.replace(/\bh-20\b/g, 'h-16 px-6');
  });

  // Replace specific logo wrappers and spacing
  content = content.replace(/gap-2\.5/g, 'gap-3'); // Add more gap
  content = content.replace(/gap-2/g, 'gap-3');
  
  // Icon sizes: w-8 h-8 -> w-10 h-10, w-9 h-9 -> w-10 h-10
  content = content.replace(/w-8 h-8 rounded-lg/g, 'w-10 h-10 rounded-lg');
  content = content.replace(/w-9 h-9 rounded-lg/g, 'w-10 h-10 rounded-lg');
  
  // Text sizes for branding names:
  content = content.replace(/text-xl font-bold tracking-tight text-gray-900/g, 'text-2xl font-semibold tracking-tight text-gray-900');
  content = content.replace(/font-bold text-xl tracking-tight text-gray-900/g, 'text-2xl font-semibold tracking-tight text-gray-900');
  
  // Dashboard brand text (Sidebar)
  content = content.replace(/font-bold text-sm text-gray-900 tracking-tight/g, 'font-semibold text-xl text-gray-900 tracking-tight');
  
  // Admin sidebar brand text
  content = content.replace(/font-bold text-sm tracking-tight uppercase text-slate-900/g, 'font-semibold text-xl tracking-tight text-gray-900');

  // Some navbars use py-4, let's make it h-16
  content = content.replace(/items-center w-full py-4/g, 'items-center w-full h-16 px-6');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated branding in: ${path.relative(__dirname, file)}`);
  }
});

console.log('Branding normalization complete.');
