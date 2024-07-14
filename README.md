# VS Code Quick Projects extension

This is a plugin to quickly open a subfolder of one of your favourite directories (say `~/Documents` or `~/code`) as a new project.
There are similar extensions like <https://github.com/kurt67/vscode-projects>, but it seems overly complicated with stuff like caching, etc.
My goal with this extension is to have an simple extension (one single JavaScript file, no TypeScript, etc) that is easy to customize.

## Installation

This plugin is currently not publidhed to the VS Code Marketplace or any alternative marketplaces.
You can install it by cloning / downloading the current code.
Once you have done that open VS Code, open the command window (`Ctrl-Shift-P` on Linux and Windows, `Cmd-Shift-P` on macOS) and search for the command `Developer: Install Extension from Location...`.
Then select the folder where you downloaded the source code too.

## Usage

There are four commands defined that can be used to quickly show a list of projects:

- `Quick Projects: Open personal project`: Show a list of subdirectories of your personal project directory (configurable in the settings).
- `Quick Projects: Open external project`: Show a list of subdirectories of your external project directory (configurable in the settings).
- `Quick Projects: Open work project`: Show a list of subdirectories of your work project directory (configurable in the settings).
- `Quick Projects: Open any project`: Show a list of subdirectories of all the directories you defined (personal, external, and work).

When you select a project, it will be either opened in the current window (default) or a new window.
This can also be changed in the settings.

Tip: You can select the commands fastest if you type `qp X`, where `X` is one of `p` for personal, `e` for external, `w` for work, or `a` for any.

There are also keyboard shortcuts of the format `Ctrl-Alt-X` for each command, where `X` is again one of `p`, `e`, `w`, or `a`.

## Settings

The settings specify which folders the extension uses as your base-folder for personal, external, and work projects.
You can also choose whether projects should be opened in the current window or in a new window.

You can open the settings by opening the general VS Code settings (`Code` -> `Settings...` -> `Settings`).
Then expand the `Extensions` category and scroll down to `Quick Projects`.

## Release Notes / Changelog

### Version 0.1.0 (unpublished)

Initial version
