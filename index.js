#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const config = {
  compilerOptions: {
    target: 'ES6'
  },
  files: [
    'typings/node/node.d.ts'
  ]
};

let directories;
if (process.argv.length > 2) {
  directories = process.argv.slice(2);
  directories.forEach(fs.statSync); // Will throw an error if any file doesn't exist
} else {
  directories = [ process.cwd() ];
}

function processDir(dir, baseDir) {
  const contents = fs.readdirSync(dir);
  for (let file of contents) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules') {
        processDir(filePath, baseDir);
      }
    } else if (/\.jsx?$/.test(filePath)) {
      config.files.push(path.relative(baseDir, filePath));
    }
  }
}
directories.forEach((dir) => processDir(dir, dir));
fs.writeFileSync('jsconfig.json', JSON.stringify(config, null, '  '));
