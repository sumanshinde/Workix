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

  // 1. Text / Formatting Replacements
  // Jargon
  content = content.replace(/\bActivation Protocol\b/gi, 'Profile Activation');
  content = content.replace(/\bGrowth Protocol\b/gi, 'Growth');
  content = content.replace(/\bTrust Protocol\b/gi, 'Trust System');
  content = content.replace(/\bSelect ID Protocol\b/gi, 'Select ID Type');
  content = content.replace(/\bProtocol Status\b/gi, 'Verification Status');
  content = content.replace(/\bprotocol experience\b/gi, 'freelance experience');
  content = content.replace(/\bNext Protocol Phase\b/gi, 'Next Step');
  content = content.replace(/\bReset All Protocols\b/gi, 'Reset Filters');
  content = content.replace(/\bprotocols\b/gi, 'rules');
  content = content.replace(/\bProtocol\b/g, 'System'); // catch any remaining Title Case
  content = content.replace(/\bprotocol\b/g, 'system'); 
  
  content = content.replace(/\bMission Center\b/gi, 'Job Center');
  content = content.replace(/\bMission Control\b/gi, 'Dashboard');
  content = content.replace(/\bmission-critical\b/gi, 'critical');
  content = content.replace(/\bnext mission\b/gi, 'next gig');
  content = content.replace(/\bmission\b/gi, 'gig');
  content = content.replace(/\bMission\b/gi, 'Gig');

  content = content.replace(/\bIdentity Matrix\b/gi, 'Identity Verification');
  content = content.replace(/\bCORE MATRIX\b/gi, 'CORE LAYOUT');
  content = content.replace(/\bTECH MATRIX\b/gi, 'TECH STACK');
  content = content.replace(/\bCategory Matrix\b/gi, 'Categories');
  content = content.replace(/\bNull Matrix State\b/gi, 'No Results Found');
  content = content.replace(/\bFilter Matrix\b/gi, 'Filters');
  content = content.replace(/\bknowledge matrix\b/gi, 'knowledge base');
  content = content.replace(/\bInfrastructure Matrix\b/gi, 'Infrastructure');
  content = content.replace(/\bNode Matrix\b/gi, 'Users');
  content = content.replace(/\beconomic matrix\b/gi, 'fee structure');
  content = content.replace(/\bPerformance Matrix\b/gi, 'Performance');
  content = content.replace(/\bNetwork Health Matrix\b/gi, 'Network Health');
  
  content = content.replace(/\bbuild your professional legacy\b/gi, 'build your professional profile');
  content = content.replace(/\bfreelance legacy\b/gi, 'freelance career');
  content = content.replace(/\blegacy rewards\b/gi, 'referral rewards');

  // Font styling fixes
  content = content.replace(/\bfont-black\b/g, 'font-bold');
  content = content.replace(/\bfont-extrabold\b/g, 'font-semibold');
  content = content.replace(/\btracking-tighter\b/g, 'tracking-tight');
  content = content.replace(/\btracking-\[0\.[23]em\]\b/g, 'tracking-wider'); // reduce crazy tracking
  content = content.replace(/\bitalic\b/g, ''); // remove excessive italics
  
  // 2. Class Replacements (Cards and Glows)
  const classNameRegex = /className="([^"]+)"/g;
  content = content.replace(classNameRegex, (match, classStr) => {
    let modified = classStr;
    
    // Remove glow rings/divs entirely if they are just background decorations
    if (modified.includes('blur-') || modified.includes('bg-gradient-') || modified.includes('from-') || modified.includes('to-')) {
        modified = modified.replace(/\bblur-[23]xl\b/g, '');
        modified = modified.replace(/\bbg-gradient-to-[a-z]+\b/g, '');
        modified = modified.replace(/\bfrom-[a-z]+-[0-9]+(\/[0-9]+)?\b/g, '');
        modified = modified.replace(/\bto-[a-z]+-[0-9]+(\/[0-9]+)?\b/g, '');
    }

    // Card Specific
    if (modified.includes('rounded-[32px]') || modified.includes('rounded-[40px]') || modified.includes('rounded-[24px]') || modified.includes('rounded-3xl') || modified.includes('rounded-2xl')) {
        modified = modified.replace(/\brounded-\[[0-9]+px\]\b/g, 'rounded-xl');
        modified = modified.replace(/\brounded-3xl\b/g, 'rounded-xl');
        modified = modified.replace(/\brounded-2xl\b/g, 'rounded-xl');
    }

    // Replace massive shadows
    modified = modified.replace(/\bshadow-(2xl|xl|lg)\b/g, 'shadow-sm');
    
    // Glassmorphism removal
    // Typically `bg-white/10 backdrop-blur-md border-white/20`
    modified = modified.replace(/\bbackdrop-blur-[a-z]+\b/g, '');
    modified = modified.replace(/\bgrowing effects\b/g, '');

    // Cleanup excessive spaces that might result
    modified = modified.replace(/\s+/g, ' ').trim();

    return `className="${modified}"`;
  });

  // Remove elements that become empty divs due to glow removal
  // E.g. <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -mr-32 -mt-32" />
  // after replace becomes <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -mr-32 -mt-32" />
  // We can just wipe out those specific background glow divs.
  content = content.replace(/<div\s+className="absolute[^>]*bg-[a-z]+-[0-9]+\/[0-9]+[^>]*rounded-full[^>]*\/>/g, '');

  // Card component glass prop
  content = content.replace(/<Card[^>]*glass\b/g, match => match.replace(/\s+glass/, ''));

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Cleaned: ${path.relative(__dirname, file)}`);
  }
});

console.log('SaaS Cleanup Complete.');
