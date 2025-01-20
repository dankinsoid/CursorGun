# Cursor Gun

A VSCode extension that provides powerful multiple cursor capabilities with intuitive keyboard shortcuts.

## Features

### Pattern-Based Cursors and Selections
- **Add Cursors at Regex Matches** (`Alt+/`): Add cursors at all matches of a regex pattern
- **Select All Regex Matches** (`Alt+Shift+/`): Create selections of all regex pattern matches
- **Add Cursors at Character** (`Alt+f`): Add cursors at all occurrences of a specific character

### Smart Cursor Placement
- **Add Cursors Around Word**: Add cursors at the start and end of the current word
- **Add Cursors Inside Brackets** (`Alt+i`): Add cursors inside the nearest brackets/quotes
- **Add Cursors Around Brackets**: Add cursors around the nearest brackets/quotes

### Selection Scope
All commands work either:
- On the entire document when no text is selected
- Only within the selected text when there's an active selection

## Installation

Install this extension from the VSCode Marketplace:
1. Open VSCode
2. Go to Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`)
3. Search for "Cursor Gun"
4. Click Install

## Usage Examples

1. Add cursors at regex matches:
   - Press `Alt+/`
   - Type your regex pattern (e.g., "console.log")
   - Press Enter to confirm
   - Live preview shows where cursors will be placed

2. Select all regex matches:
   - Press `Alt+Shift+/`
   - Type your regex pattern
   - Press Enter to create selections
   - Live preview shows matches as you type

3. Add cursors at character matches:
   - Press `Alt+f`
   - Type any single character
   - Cursors are added at all occurrences

4. Add cursors inside brackets:
   - Place cursor inside any brackets/quotes: (), [], {}, "", '', ``
   - Press `Alt+i`
   - Cursors are added after opening and before closing brackets

## Supported Commands

All commands can be run from the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`):

- `CursorGun: Add Cursors at Regex Matches`
- `CursorGun: Select All Regex Matches`
- `CursorGun: Add Cursors at Character`
- `CursorGun: Add Cursors at Word Start`
- `CursorGun: Add Cursors Around Word`
- `CursorGun: Add Cursors Inside Brackets`
- `CursorGun: Add Cursors Around Brackets`

## Keyboard Shortcuts

- `Alt+/`: Add cursors at regex matches
- `Alt+Shift+/`: Select all regex matches
- `Alt+f`: Add cursors at character matches
- `Alt+i`: Add cursors inside brackets

Additional shortcuts can be configured in VSCode's Keyboard Shortcuts settings.
