# OmniFocus ↔ Bear Linker

**English** · [简体中文](README.zh-CN.md)

Create a Bear note from an OmniFocus task in one click, with its title, tags and a link back to the task. The Bear note link is appended to the original task's note.

[Download the plug-in](https://github.com/qllllll/omnifocus-bear-linker/releases/latest/download/OmniFocusBearLinker.omnifocusjs) · [Releases](https://github.com/qllllll/omnifocus-bear-linker/releases) · [MIT license](LICENSE)

## Features

- Uses the task name as the Bear note title.
- Copies the task's tags, including nested tag paths, and adds `OmniFocus` as a common tag.
- Includes an `omnifocus:///task/TASK_ID` link, the containing project when available, the original note text, and a section for working notes.
- Appends `bear://x-callback-url/open-note?id=NOTE_ID` to the original task, preserving its existing note and attachments.
- Opens an existing Bear note when a matching link is already present in the task note.
- Prevents a second submission for the same task while creation is pending.

The menu entry and generated note template currently use Chinese labels. The menu entry is **创建或打开 Bear 笔记** (“Create or open a Bear note”).

## Requirements

- macOS with OmniFocus Pro and Omni Automation support.
- Bear installed and available to open notes.

Manually tested with **OmniFocus 4.9.3 Pro** and **Bear 3.0.2** on macOS. Other versions and iOS/iPadOS have not been verified. The installed plug-in does not require Node.js, a Bear API token, or a background service.

## Install

1. Download `OmniFocusBearLinker.omnifocusjs` from the [latest release](https://github.com/qllllll/omnifocus-bear-linker/releases/latest).
2. Double-click the file. If macOS asks which app to use, choose OmniFocus.
3. Confirm that **创建或打开 Bear 笔记** appears in OmniFocus's **Automation** menu or **Automation → Configure → Plug-Ins**.

You can also install the [source file](OmniFocusBearLinker.omnifocusjs) from this repository. Keep the `.omnifocusjs` extension.

## Use

1. Select **one task** in OmniFocus.
2. Right-click the **task title**, then choose **Omni Automation → 创建或打开 Bear 笔记**. In a Chinese interface, the submenu is **Omni 自动化**.
3. Bear opens the new note. The corresponding Bear link is automatically added to that task's note.

You can also run the same action from the top-level **Automation** menu. Right-clicking inside the task's note editor opens a text-editing menu; right-click the task title to access the automation action.

Click the task link in Bear to return to OmniFocus. Run the action again to open the linked Bear note instead of creating another one.

## Customize

Edit `DEFAULT_TAG` near the top of the plug-in before installing it:

```javascript
const DEFAULT_TAG = "OmniFocus";
```

Set it to `""` to use only the task's tags. Nested OmniFocus tags become Bear paths such as `Research/Assimilation`. Commas, hash signs and slashes within an individual tag name are converted to their full-width equivalents; hierarchy separators remain `/`.

The title, body template and menu labels can be customized in the same file. Reopen the file in OmniFocus after changing it.

## Behavior and privacy

- This is an on-demand creation/linking action, not continuous synchronization. Later edits in one app are not mirrored to the other.
- Attachments stay in OmniFocus. Only the plain-text portion of the original note is copied to Bear.
- Existing links are detected in the task note text using the `bear://x-callback-url/open-note?...id=...` format.
- Repeating tasks that inherit a Bear link reuse that note. Remove the inherited link first if a particular occurrence needs its own note.
- Task data passes between the installed apps using local URL schemes. This plug-in has no server or telemetry; each app's own sync settings still apply.
- A failed creation does not overwrite the task note. If Bear creates a note but the task cannot be updated, an alert provides the Bear link for manual recovery. The plug-in does not automatically retry an ambiguous creation.

## Troubleshooting and removal

If the action is disabled, select exactly one task and check that OmniFocus Pro is available. If **all** automation actions and the console remain disabled after installation, reopen OmniFocus and try again.

The plug-in does not require enabling **Accept scripts from external applications**. If a Bear operation fails, check that Bear can open normally and review the displayed error before retrying.

To uninstall, remove this plug-in from **Automation → Configure → Plug-Ins**. Existing notes and links remain in the two apps.

## Development

Node.js **22 or newer** is needed only for development. There are no npm dependencies, so no install step is required.

```sh
npm test
npm run check
npm run build
```

The build places the installable plug-in and `SHA256SUMS` in `dist/`. The release file includes the complete MIT license notice.

The six behavior tests cover Unicode, tag hierarchy, preserving concurrent note edits, duplicate calls and failure recovery. The commands above check mocked API behavior and package integrity without running OmniFocus or Bear. Native-app creation and link write-back were checked manually in the versions listed above.

The [GitHub Actions workflow](.github/workflows/test.yml) runs these commands and verifies the build checksum on Node.js 22 and 24 for every push and pull request. It can also be started manually from the repository's Actions tab. The workflow uses read-only repository permissions and does not require a personal token or access to your OmniFocus or Bear data.

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidance and [CHANGELOG.md](CHANGELOG.md) for release history.

## API references and license

- [Omni Automation URL callbacks](https://omni-automation.com/shared/url.html)
- [OmniFocus tasks and appending notes](https://omni-automation.com/omnifocus/task.html)
- [Bear x-callback-url documentation](https://bear.app/faq/x-callback-url-scheme-documentation/)

Released under the [MIT License](LICENSE). This is an independent integration and is not affiliated with The Omni Group or Bear.
