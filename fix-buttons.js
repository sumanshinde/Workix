const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

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

  // Pattern to find standard strings in className="..."
  const classNameRegex = /className="([^"]+)"/g;

  content = content.replace(classNameRegex, (match, classStr) => {
    // If it looks like one of those huge layout buttons
    if (classStr.match(/\b(h-1[246]|w-1[46]|px-1[02]|px-[68]|shadow-2xl|shadow-xl|rounded-2xl|text-lg)\b/)) {
        
        // Skip if it's an avatar wrapper, typically w-14 h-14 bg-gray-50 rounded-full/rounded-2xl
        // Let's protect them
        if (classStr.match(/bg-gray-50/) && classStr.match(/flex items-center justify-center/) && classStr.match(/w-1/)) return match;
        if (classStr.match(/w-1/) && classStr.match(/shrink-0/)) return match;

        let modified = classStr
          .replace(/\bh-1[246]\b/g, '') // remove large heights
          .replace(/\bpx-[68]\b/g, '')  // remove large horizontal padding
          .replace(/\bpx-1[02]\b/g, '') // remove huge horizontal padding
          .replace(/\brounded-(xl|2xl|3xl|full)\b/g, 'rounded-lg') // scale down border radius
          .replace(/\bshadow-(md|lg|xl|2xl)\b/g, 'shadow-sm') // scale down shadow
          .replace(/\btext-(lg|base|xl)\b/g, 'text-sm') // scale down font sizes
          .replace(/\bfont-extrabold\b/g, 'font-bold') // tame the font weight slightly
          .replace(/\bfont-black\b/g, 'font-bold'); // tame the font weight slightly
          
        modified = modified.replace(/\s+/g, ' ').trim();
        
        return `className="${modified}"`;
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${path.relative(__dirname, file)}`);
  }
});

console.log('Button class replacement complete.');
