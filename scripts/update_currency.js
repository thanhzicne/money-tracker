const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (dirFile.endsWith('.jsx') || dirFile.endsWith('.js') && !dirFile.includes('node_modules')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const files = walkSync(path.join(__dirname, 'src'));

let updatedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Pattern 1: Multi-line formatCurrency with i18n
  const pattern1 = /const\s+formatCurrency\s*=\s*\([^)]*\)\s*=>\s*\{\s*return\s+new\s+Intl\.NumberFormat\([^)]*\)\s*\.format\([^)]*\);\s*\}/g;
  const replacement1 = `const formatCurrency = (amount) => {
    if (typeof i18n !== 'undefined' && i18n.language === 'en') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }
    return \`\${new Intl.NumberFormat('vi-VN').format(amount)} VNĐ\`;
  }`;

  content = content.replace(pattern1, replacement1);

  // Pattern 2: Component formatCurrencies that might not have been caught due to formatting
  // Using a more lenient regex to catch the entire function body
  const pattern2 = /const\s+formatCurrency\s*=\s*\(amount\)\s*=>\s*\{[\s\S]*?return\s+new\s+Intl\.NumberFormat[\s\S]*?\.format\(amount\);\s*\}/g;
  content = content.replace(pattern2, replacement1);

  // Hardcoded instances:
  
  // Dashboard.jsx
  content = content.replace(
    /new\s+Intl\.NumberFormat\('vi-VN',\s*\{\s*style:\s*'currency',\s*currency:\s*'VND'\s*\}\)\.format\(balance\)/g,
    "`${new Intl.NumberFormat('vi-VN').format(balance)} VNĐ`"
  );

  // exportUtils.js
  content = content.replace(
    /new\s+Intl\.NumberFormat\('en-US',\s*\{\s*style:\s*'currency',\s*currency:\s*'VND'\s*\}\)\.format\(t\.amount\)\.replace\('\$',\s*''\)/g,
    "`${new Intl.NumberFormat('vi-VN').format(t.amount)} VNĐ`"
  );

  // aiService.js
  content = content.replace(
    /new\s+Intl\.NumberFormat\('vi-VN',\s*\{\s*style:\s*'currency',\s*currency:\s*'VND'\s*\}\)/g,
    "{ format: (amt) => `${new Intl.NumberFormat('vi-VN').format(amt)} VNĐ` }"
  );

  // useMoneyTracker.js
  content = content.replace(
    /\$\{amount\.toLocaleString\(\)\}\đ/g,
    "${new Intl.NumberFormat('vi-VN').format(amount)} VNĐ"
  );

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    updatedCount++;
    console.log(`Updated: ${file}`);
  }
});

console.log(`Total files updated: ${updatedCount}`);
