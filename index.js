#!/usr/bin/env node
/*
Copyright (c) 2015 Bryan Hughes <bryan@theoreticalideations.com>

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

'use strict';

const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

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

function processDir(dir) {
  const contents = fs.readdirSync(dir);
  for (let file of contents) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules') {
        processDir(filePath);
      }
    } else if (/\.jsx?$/.test(filePath)) {
      config.files.push(path.relative(process.cwd(), filePath));
    }
  }
}
directories.forEach(processDir);
fs.writeFileSync('jsconfig.json', JSON.stringify(config, null, '  '));

execSync('tsd query node --action install');