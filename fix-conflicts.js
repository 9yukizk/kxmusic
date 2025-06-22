const fs = require('fs');
const path = require('path');

// Function to recursively find all files with merge conflicts
function findFilesWithConflicts(dir) {
  const files = [];
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scanDirectory(fullPath);
      } else if (stat.isFile() && !item.endsWith('.js') && !item.endsWith('.ts') && !item.endsWith('.tsx') && !item.endsWith('.json') && !item.endsWith('.md') && !item.endsWith('.html') && !item.endsWith('.css')) {
        continue; // Skip non-text files
      } else if (stat.isFile()) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes('')) {
            files.push(fullPath);
          }
        } catch (error) {
          // Skip files that can't be read as text
        }
      }
    }
  }
  
  scanDirectory(dir);
  return files;
}

// Function to fix merge conflicts in a file
function fixMergeConflicts(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove merge conflict markers and keep the HEAD version
    content = content.replace(/\n([\s\S]*?)\n\n[\s\S]*?\n    
    // Remove any remaining conflict markers
    content = content.replace(/\n?/g, '');
    content = content.replace(/\n?/g, '');
    content = content.replace(/    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  } catch (error) {
    console.log(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
console.log('🔍 Searching for files with merge conflicts...');
const filesWithConflicts = findFilesWithConflicts('.');

if (filesWithConflicts.length === 0) {
  console.log('✅ No files with merge conflicts found!');
} else {
  console.log(`📁 Found ${filesWithConflicts.length} files with merge conflicts:`);
  
  let fixedCount = 0;
  for (const file of filesWithConflicts) {
    if (fixMergeConflicts(file)) {
      fixedCount++;
    }
  }
  
  console.log(`\n🎉 Fixed ${fixedCount} out of ${filesWithConflicts.length} files!`);
} 