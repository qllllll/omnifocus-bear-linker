// SPDX-License-Identifier: MIT
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const metadata = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const source = fs.readFileSync(path.join(root, 'OmniFocusBearLinker.omnifocusjs'), 'utf8');
const license = fs.readFileSync(path.join(root, 'LICENSE'), 'utf8').trim();
const header = source.match(/^\/\*(\{[\s\S]*?\})\*\//);
assert.ok(header, 'The Omni Automation manifest must be the first comment.');
const manifest = JSON.parse(header[1]);
assert.equal(manifest.type, 'action');
assert.deepEqual(manifest.targets, ['omnifocus']);
assert.equal(manifest.identifier, 'cn.sferic.omnifocus.bear-note');
assert.equal(manifest.version, metadata.version);
assert.equal(metadata.license, 'MIT');
assert.ok(source.includes('SPDX-License-Identifier: MIT'));
assert.ok(source.includes(license), 'The standalone download must include the full license notice.');
new vm.Script(source, { filename: 'OmniFocusBearLinker.omnifocusjs' });

for (const name of ['README.md', 'README.zh-CN.md', 'CONTRIBUTING.md', 'CHANGELOG.md']) {
  const text = fs.readFileSync(path.join(root, name), 'utf8');
  for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
    const target = match[1];
    if (/^[a-z][a-z\d+.-]*:/i.test(target) || target.startsWith('#')) continue;
    const file = decodeURIComponent(target.split('#')[0]);
    assert.ok(fs.existsSync(path.resolve(root, file)), `${name}: missing link target ${file}`);
  }
}
assert.ok(fs.readFileSync(path.join(root, 'README.md'), 'utf8').includes('(README.zh-CN.md)'));
assert.ok(fs.readFileSync(path.join(root, 'README.zh-CN.md'), 'utf8').includes('(README.md)'));
console.log(`Package checks passed: v${metadata.version}, manifest, license, syntax and documentation links.`);
