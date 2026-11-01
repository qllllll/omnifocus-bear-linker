// SPDX-License-Identifier: MIT
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const { test } = require('node:test');
const source = fs.readFileSync(path.join(__dirname, '..', 'OmniFocusBearLinker.omnifocusjs'), 'utf8');

function harness(options = {}) {
  let note = options.note || '';
  const requests = [], opened = [], alerts = [];
  const task = {
    id: { primaryKey: 'testTask123' }, name: '中文 & 标题 #1 🐻',
    tags: [{ name: '同化', parent: { name: '科研', parent: null } }],
    containingProject: { name: '项目 A' },
    get note() { return note; },
    set note(_) { throw Error('must not replace rich notes'); },
    appendStringToNote(text) { note += text; }
  };
  const action = vm.runInNewContext(source, {
    PlugIn: { Action: class { constructor(run) { this.run = run; } } },
    URL: {
      currentAppScheme: 'com.omnigroup.OmniFocus4',
      fromString(url) { return { open() { opened.push(url); }, call(success, failure) {
        requests.push({ url: new URL(url), success, failure });
      } }; }
    },
    Task: { byIdentifier(id) { assert.equal(id, task.id.primaryKey); return options.deleted ? null : task; } },
    Alert: class { constructor(title, message) { this.title = title; this.message = message; }
      async show() { alerts.push(this.message); } }
  });
  return { action, task, requests, opened, alerts, editNote: value => { note = value; } };
}

test('中文标题、嵌套标签、任务链接与追加回链；保留回调期间编辑的备注', async () => {
  const h = harness({ note: '保留原备注 **格式**' });
  const run = h.action.run({ tasks: [h.task] });
  const q = h.requests[0].url.searchParams;
  assert.equal(q.get('title'), h.task.name);
  assert.equal(q.get('tags'), 'OmniFocus,科研/同化');
  assert.match(q.get('text'), /omnifocus:\/\/\/task\/testTask123/);
  assert.match(q.get('text'), /所属项目：项目 A/);
  assert.match(q.get('text'), /保留原备注 \*\*格式\*\*/);
  assert.equal(h.action.validate({ tasks: [h.task] }), false);
  h.editNote('保留原备注 **格式**\n用户刚刚补充的文字');
  h.requests[0].success({}, { identifier: 'NOTE-123', title: h.task.name });
  await run;
  assert.match(h.task.note, /^保留原备注 \*\*格式\*\*\n用户刚刚补充的文字/);
  assert.match(h.task.note, /bear:\/\/x-callback-url\/open-note\?id=NOTE-123$/);
  assert.equal(h.opened.length, 1);
  await h.action.run({ tasks: [h.task] });
  assert.equal(h.requests.length, 1);
  assert.equal(h.opened.length, 2);
});

test('识别已有 Markdown Bear 链接且不修改备注', async () => {
  const note = '[笔记](bear://x-callback-url/open-note?id=ABC-123)\n其他说明';
  const h = harness({ note });
  await h.action.run({ tasks: [h.task] });
  assert.equal(h.task.note, note);
  assert.equal(h.requests.length, 0);
  assert.equal(h.opened[0], 'bear://x-callback-url/open-note?id=ABC-123');
});

test('创建失败不修改备注，并恢复按钮', async () => {
  const h = harness({ note: '不可丢失' });
  const run = h.action.run({ tasks: [h.task] });
  h.requests[0].failure({ errorMessage: 'Bear 已锁定' });
  await run;
  assert.equal(h.task.note, '不可丢失');
  assert.equal(h.alerts[0], 'Bear 已锁定');
  assert.equal(h.action.validate({ tasks: [h.task] }), true);
});

test('回调不含 ID 时不写伪造链接或自动重试', async () => {
  const h = harness();
  const run = h.action.run({ tasks: [h.task] });
  h.requests[0].success({}, { title: '仅有标题' });
  await run;
  assert.equal(h.task.note, '');
  assert.equal(h.requests.length, 1);
  assert.match(h.alerts[0], /先在 Bear 中按任务标题查找/);
});

test('回调时任务已删除，显示创建成功的笔记链接供恢复', async () => {
  const h = harness({ deleted: true });
  const run = h.action.run({ tasks: [h.task] });
  h.requests[0].success({}, { identifier: 'RECOVERY-123' });
  await run;
  assert.equal(h.task.note, '');
  assert.match(h.alerts[0], /bear:\/\/x-callback-url\/open-note\?id=RECOVERY-123/);
});

test('无选择、多选及同一任务正在创建时不会重复提交', async () => {
  const h = harness();
  assert.equal(h.action.validate({ tasks: [] }), false);
  assert.equal(h.action.validate({ tasks: [h.task, h.task] }), false);
  await h.action.run({ tasks: [] });
  const run = h.action.run({ tasks: [h.task] });
  await h.action.run({ tasks: [h.task] });
  assert.equal(h.requests.length, 1);
  h.requests[0].success({}, { identifier: 'ONCE-123' });
  await run;
});
