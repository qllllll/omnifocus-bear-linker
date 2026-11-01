# OmniFocus ↔ Bear 双向链接插件

[English](README.md) · **简体中文**

在 OmniFocus 里选中任务，一键创建对应的 Bear 笔记，自动准备标题、标签和任务回链，并把 Bear 链接追加到原任务备注。

[下载插件](https://github.com/qllllll/omnifocus-bear-linker/releases/latest/download/OmniFocusBearLinker.omnifocusjs) · [版本发布](https://github.com/qllllll/omnifocus-bear-linker/releases) · [MIT 开源协议](LICENSE)

## 功能

- 使用任务名称作为 Bear 笔记标题。
- 复制任务标签，保留父子层级，并添加统一标签 `OmniFocus`。
- 自动加入 `omnifocus:///task/任务ID` 链接、所属项目（如有）、任务原备注和工作记录区域。
- 把 `bear://x-callback-url/open-note?id=笔记ID` 追加到原任务备注，保留已有备注及附件。
- 备注中已有对应格式的 Bear 链接时，直接打开原笔记。
- 创建尚未返回时，同一任务不会重复提交。

插件菜单和生成的笔记模板目前使用中文，菜单名称为 **创建或打开 Bear 笔记**。

## 环境要求

- macOS，以及支持 Omni Automation 的 OmniFocus Pro。
- 已安装、可以正常打开笔记的 Bear。

已在 macOS 的 **OmniFocus 4.9.3 Pro** 与 **Bear 3.0.2** 中完成手工联调。其他版本和 iOS/iPadOS 尚未验证。安装后的插件不需要 Node.js、Bear API Token 或后台服务。

## 安装

1. 从[最新发布页](https://github.com/qllllll/omnifocus-bear-linker/releases/latest)下载 `OmniFocusBearLinker.omnifocusjs`。
2. 双击文件；若 macOS 询问打开方式，选择 OmniFocus。
3. 确认 OmniFocus 顶部「自动化」菜单，或「自动化 → 配置 → 插件」中出现 **创建或打开 Bear 笔记**。

也可以安装仓库中的[插件源文件](OmniFocusBearLinker.omnifocusjs)，请保留 `.omnifocusjs` 扩展名。

## 使用

1. 在 OmniFocus 选中**一个任务**。
2. **右键任务标题 → Omni 自动化 → 创建或打开 Bear 笔记**。
3. Bear 打开新笔记，原任务备注中自动出现对应的 Bear 链接。

也可以从顶部「自动化」菜单运行同一动作。在备注编辑区内部右键会弹出文本编辑菜单；请在任务标题上右键以显示自动化入口。

在 Bear 点击任务链接即可返回 OmniFocus。再次运行插件会打开已关联的 Bear 笔记。

## 自定义

安装前，可以修改插件顶部的统一标签：

```javascript
const DEFAULT_TAG = "OmniFocus";
```

设为 `""` 则仅使用任务自身的标签。父子标签映射为 Bear 的层级，例如 `科研/同化`。单个标签名称中的逗号、井号和斜线会转为全角字符；父子关系的分隔符仍使用 `/`。

标题、正文模板和菜单名称也可以在同一文件中修改。修改后，重新用 OmniFocus 打开插件文件。

## 行为与隐私

- 这是按需创建和关联，不会持续同步两边后续的修改。
- 附件保留在 OmniFocus；Bear 笔记只复制原备注的文本部分。
- 插件从任务备注文本中识别 `bear://x-callback-url/open-note?...id=...` 格式的已有链接。
- 重复任务如果继承了 Bear 链接，会沿用同一篇笔记。需要为某次任务新建独立笔记时，先移除继承的链接。
- 任务数据通过本机应用的 URL Scheme 传递。插件没有服务器或遥测；两款应用各自的同步设置仍然有效。
- 创建失败不会覆盖任务备注。若 Bear 已创建笔记，但无法写回原任务，会显示 Bear 链接供手工恢复；插件不会自动重试结果不明确的创建请求。

## 排错与卸载

按钮呈灰色时，请确认只选中了一个任务，并且 OmniFocus Pro 可用。若安装后所有自动化动作和控制台都呈灰色，可重新打开一次 OmniFocus 后再试。

插件不需要开启「接受外部应用程序的脚本」。Bear 操作失败时，请检查 Bear 是否可以正常打开，并先阅读错误信息再决定是否重试。

卸载时，在「自动化 → 配置 → 插件」中移除此插件。两款应用中已有的笔记和链接会保留。

## 开发与验证

只有开发时需要 **Node.js 22 或更新版本**。项目没有 npm 依赖，无需执行安装命令。

```sh
npm test
npm run check
npm run build
```

构建结果位于 `dist/`，包括可安装的插件和 `SHA256SUMS`。发布的插件文件本身包含完整 MIT 授权声明。

6 项行为测试覆盖中文与特殊字符、标签层级、保留回调期间的备注编辑、重复调用及失败恢复。上述命令检查模拟 API 行为与发布包完整性，不运行 OmniFocus 或 Bear；原生应用的创建与回写已在上述版本中手工联调。

[GitHub Actions 工作流](.github/workflows/test.yml)会在每次推送和提交 PR 时，使用 Node.js 22、24 分别运行上述命令并校验构建文件的校验和。也可以从仓库的 Actions 页面手动启动。工作流仅使用仓库只读权限，无需个人令牌，也不会访问你的 OmniFocus 或 Bear 数据。

贡献方式见 [CONTRIBUTING.md](CONTRIBUTING.md)，版本变化见 [CHANGELOG.md](CHANGELOG.md)。

## 官方接口与开源协议

- [Omni Automation URL 回调接口](https://omni-automation.com/shared/url.html)
- [OmniFocus 任务与追加备注接口](https://omni-automation.com/omnifocus/task.html)
- [Bear x-callback-url 文档](https://bear.app/faq/x-callback-url-scheme-documentation/)

本项目采用 [MIT License](LICENSE)。这是独立集成项目，与 The Omni Group 或 Bear 没有隶属关系。
