Cursor Gun 
===

<!-- Plugin description -->
This plugin adds multiple cursor and selection capabilities to VSCode

## Installation

- Using IDE built-in plugin system:
  
  <kbd>Settings/Preferences</kbd> > <kbd>Plugins</kbd> > <kbd>Marketplace</kbd> > <kbd>Search for "VimMulticursor"</kbd> >
  <kbd>Install Plugin</kbd>
  
- Manually:

  Download the [latest release](https://github.com/dankinsoid/VimMulticursor/releases/latest) and install it manually using
  <kbd>Settings/Preferences</kbd> > <kbd>Plugins</kbd> > <kbd>⚙️</kbd> > <kbd>Install plugin from disk...</kbd>

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
