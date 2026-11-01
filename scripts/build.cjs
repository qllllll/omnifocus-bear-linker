// SPDX-License-Identifier: MIT
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
require('./verify-package.cjs');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
const filename = 'OmniFocusBearLinker.omnifocusjs';
const bytes = fs.readFileSync(path.join(root, filename));
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, filename), bytes);
const checksum = crypto.createHash('sha256').update(bytes).digest('hex');
fs.writeFileSync(path.join(output, 'SHA256SUMS'), `${checksum}  ${filename}\n`);
console.log(`Built dist/${filename} and dist/SHA256SUMS.`);
