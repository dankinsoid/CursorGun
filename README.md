# Cursor Gun

A VSCode extension that provides powerful multiple cursor capabilities with intuitive commands.

## Features

### Add Cursors and Selections by Pattern
- **Add Cursors at Regex Matches** (`Alt+/`): Add cursors at all matches of a regex pattern
- **Select All Regex Matches** (`Alt+Shift+/`): Create selections of all regex pattern matches
- **Add Cursors at Character** (`Alt+F`): Add cursors at all occurrences of a specific character

### Smart Cursor Placement
- **Add Cursors Around Word**: Add cursors at the start and end of the current word
- **Add Cursors Inside Brackets**: Add cursors inside the nearest brackets/quotes
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

1. Add cursors at all occurrences of a pattern:
   - Press `Alt+/`
   - Type your regex pattern (e.g., "console.log")
   - Press Enter

2. Add cursors around the current word:
   - Place cursor inside a word
   - Run "CursorGun: Add Cursors Around Word" from command palette

3. Add cursors inside brackets:
   - Place cursor inside brackets/quotes
   - Run "CursorGun: Add Cursors Inside Brackets" from command palette

## Commands

### Basic Usage
- `mc` + command: Create multiple cursors
- `ms` + command: Create multiple selections
- All commands work within selected text when there's an active selection

### Available Commands
- `mc/` + search: Add cursors at all occurrences of search regex.
- `mcf`x, `mcF`x: Add cursors at all occurrences of character x.
- `mcw`, `mcW`, `mcb`, `mcB`: Add cursors at words start.
- `mce`, `mcE`: Add cursors at words end.
- `mcaw`: Around word
- `mca` + bracket: Around bracket, like `mca(`/`mcab`, `mca{`/`mcaB`, `mca"`, etc
- `mci` + bracket: Inside bracket, like `mci(`/`mcib`, `mci{`/`mciB`, `mci"`, etc 
- `mcaa`/`mcia`: any bracket

### Cursor Management
- `mcc`: Add or remove a cursor highlight at the current position (preview mode)
- `mcr`: Convert cursor highlights to active editing cursors
- `mcd`: Remove all cursors and highlights
- `mcia`: Place cursors inside any brackets or quotes ((), [], {}, "", '', ``)
- `mcaa`: Place cursors around any brackets or quotes
- `mcaw`: Add cursors at word boundaries (at the start and end of current word)

The `mcia` and `mcaa` commands automatically find the nearest matching pair of delimiters around the cursor, handling proper nesting and matching of brackets/quotes.

## Examples

1. Select all occurrences of "print":
   ```
   ms/print<Enter>
   ```

2. Create cursors at each word start in selection:
   ```
   msw
   ```

3. Add cursors at specific positions:
   1. Move cursor to desired position
   2. Type `mcc` to add a cursor highlight
   3. Repeat for more positions
   4. Type `mcr` to convert highlights into editing cursors

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.
