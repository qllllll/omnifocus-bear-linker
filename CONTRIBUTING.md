# Contributing / 参与贡献

## English

Issues and pull requests are welcome in English or Chinese.

1. Describe the expected behavior and the OmniFocus, Bear and macOS versions involved.
2. Keep task-note updates append-only and preserve existing content and attachments.
3. Add a focused regression test when changing callback handling, link detection or duplicate prevention.
4. Run `npm test`, `npm run check` and `npm run build`.
5. Update both README files when user-visible behavior changes. Test the affected workflow in the native apps when possible, and distinguish mocked tests from native-app checks.

Use disposable tasks and notes for testing. Do not include personal task contents, real task/note identifiers, credentials, API tokens or private screenshots in commits, issues or pull requests. Replace them with synthetic examples.

Contributions are submitted under this project's [MIT License](LICENSE).

## 简体中文

欢迎用中文或英文提交 Issue 和 Pull Request。

1. 说明预期行为，以及涉及的 OmniFocus、Bear 和 macOS 版本。
2. 更新任务备注时只追加内容，保留已有内容与附件。
3. 修改回调、链接识别或防重复逻辑时，补充针对性的回归测试。
4. 运行 `npm test`、`npm run check`、`npm run build`。
5. 用户可见行为变化时，同时更新中英文 README。条件允许时，在原生应用中验证受影响的流程，并区分模拟测试与原生联调。

请使用临时任务和笔记测试。提交、Issue 和 Pull Request 中不要包含个人任务内容、真实任务或笔记 ID、凭据、API Token 或私人截图；请替换为合成示例。

贡献内容按照本项目的 [MIT License](LICENSE) 提交。
