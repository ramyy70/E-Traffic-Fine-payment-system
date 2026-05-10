const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('src', function(filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        let newContent = content
            // Remove exactly `import React from 'react';`
            .replace(/import\s+React\s+from\s+['"]react['"];?\n?/g, '')
            // Replace `import React, { something } from 'react';` with `import { something } from 'react';`
            .replace(/import\s+React\s*,\s*\{\s*(.*?)\s*\}\s+from\s+['"]react['"];?/g, 'import { $1 } from \'react\';')
            // Drop empty imports like `import { } from 'react';`
            .replace(/import\s*\{\s*\}\s*from\s+['"]react['"];?\n?/g, '');
        
        if (filePath.includes('FineIssueForm.tsx')) {
            // The compiler said ALL imports in the declaration are unused.
            newContent = newContent.replace(/import\s*\{\s*useState\s*\}\s+from\s+['"]react['"];?\n?/g, '');
        }

        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent);
            console.log('Fixed', filePath);
        }
    }
});
