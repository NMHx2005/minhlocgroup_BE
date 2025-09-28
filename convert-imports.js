const fs = require('fs');
const path = require('path');

function convertImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Convert @/ imports to relative imports
  content = content.replace(/from ['"]@\/([^'"]+)['"]/g, (match, importPath) => {
    const currentDir = path.dirname(filePath);
    const srcDir = path.join(process.cwd(), 'src');
    const targetPath = path.join(srcDir, importPath);
    const relativePath = path.relative(currentDir, targetPath);
    const normalizedPath = relativePath.replace(/\\/g, '/');
    return `from '${normalizedPath.startsWith('.') ? normalizedPath : './' + normalizedPath}'`;
  });
  
  fs.writeFileSync(filePath, content);
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      convertImports(filePath);
    }
  });
}

// Process all TypeScript files
processDirectory('./src');
console.log('Converted all @/ imports to relative imports');