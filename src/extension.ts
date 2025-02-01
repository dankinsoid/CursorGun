// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// Decoration type for cursor previews
const cursorPreviewDecoration = vscode.window.createTextEditorDecorationType({
    backgroundColor: new vscode.ThemeColor('editor.selectionBackground'),
    border: '1px solid',
    borderColor: new vscode.ThemeColor('editor.selectionBackground')
});

interface BracketPair {
    open: string;
    close: string;
}

const BRACKETS: BracketPair[] = [
    { open: '(', close: ')' },
    { open: '[', close: ']' },
    { open: '{', close: '}' },
    { open: '<', close: '>' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: '`', close: '`' }
];

export function activate(context: vscode.ExtensionContext) {
    
    // Add cursors at regex matches
    let addCursorsAtRegex = vscode.commands.registerCommand('cursorgun.addCursorsAtRegex', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const inputBox = vscode.window.createInputBox();
        inputBox.prompt = "Enter regex pattern";
        inputBox.ignoreFocusOut = true;
        
        // Update previews as user types
        inputBox.onDidChangeValue(pattern => {
            try {
                if (!pattern) {
                    editor.setDecorations(cursorPreviewDecoration, []);
                    return;
                }

                const regex = new RegExp(pattern, 'g');
                const text = editor.document.getText(editor.selection) || editor.document.getText();
                const ranges: vscode.Range[] = [];
                const startOffset = editor.selection.isEmpty ? 0 : editor.document.offsetAt(editor.selection.start);
                
                let match;
                while ((match = regex.exec(text)) !== null) {
                    const pos = editor.document.positionAt(startOffset + match.index);
                    ranges.push(new vscode.Range(pos, pos.translate(0, 1)));
                }

                editor.setDecorations(cursorPreviewDecoration, ranges);
            } catch (e) {
                // Invalid regex - clear previews
                editor.setDecorations(cursorPreviewDecoration, []);
            }
        });

        // Handle accept/cancel
        const pattern = await new Promise<string | undefined>(resolve => {
            inputBox.onDidAccept(() => {
                const value = inputBox.value;
                inputBox.hide();
                resolve(value);
            });
            inputBox.onDidHide(() => resolve(undefined));
            inputBox.show();
        });

        // Clear previews
        editor.setDecorations(cursorPreviewDecoration, []);
        
        if (!pattern) return;

        try {
            const regex = new RegExp(pattern, 'g');
            const text = editor.document.getText(editor.selection) || editor.document.getText();
            const selections: vscode.Selection[] = [];
            const startOffset = editor.selection.isEmpty ? 0 : editor.document.offsetAt(editor.selection.start);
            
            let match;
            while ((match = regex.exec(text)) !== null) {
                const pos = editor.document.positionAt(startOffset + match.index);
                selections.push(new vscode.Selection(pos, pos));
            }

            if (selections.length > 0) {
                editor.selections = selections;
            }
        } catch (e) {
            vscode.window.showErrorMessage('Invalid regex pattern');
        }
    });

    // Add cursors at character matches
    let addCursorsAtChar = vscode.commands.registerCommand('cursorgun.addCursorsAtChar', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const char = await new Promise<string | undefined>(resolve => {
            const inputBox = vscode.window.createInputBox();
            inputBox.prompt = "Enter character to match";
            inputBox.placeholder = "Single character";
            
            inputBox.onDidChangeValue(text => {
                if (text.length === 1) {
                    const char = text;
                    inputBox.hide();
                    resolve(char);
                }
            });
            
            inputBox.onDidHide(() => resolve(undefined));
            inputBox.show();
        });

        if (!char) return;

        const text = editor.document.getText(editor.selection) || editor.document.getText();
        const selections: vscode.Selection[] = [];
        const startOffset = editor.selection.isEmpty ? 0 : editor.document.offsetAt(editor.selection.start);

        for (let i = 0; i < text.length; i++) {
            if (text[i] === char) {
                const pos = editor.document.positionAt(startOffset + i);
                selections.push(new vscode.Selection(pos, pos));
            }
        }

        if (selections.length > 0) {
            editor.selections = selections;
        }
    });

    // Add cursors at word boundaries
    let addCursorsAroundWord = vscode.commands.registerCommand('cursorgun.addCursorsAroundWord', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const selections = editor.selections.flatMap(selection => {
            const wordRange = editor.document.getWordRangeAtPosition(selection.active);
            if (wordRange) {
                return [
                    new vscode.Selection(wordRange.start, wordRange.start),
                    new vscode.Selection(wordRange.end, wordRange.end)
                ];
            }
            return [];
        });

        if (selections.length > 0) {
            editor.selections = selections;
        }
    });

    // Add cursors inside/around brackets
    function findBracketPair(text: string, position: number): { start: number, end: number } | null {
        for (const pair of BRACKETS) {
            let nesting = 0;
            let start = position;
            let end = position;

            // Search backward for opening bracket
            while (start >= 0) {
                if (text[start] === pair.close) nesting++;
                if (text[start] === pair.open) {
                    if (nesting === 0) break;
                    nesting--;
                }
                start--;
            }

            if (start < 0) continue;

            // Search forward for closing bracket
            nesting = 0;
            while (end < text.length) {
                if (text[end] === pair.open) nesting++;
                if (text[end] === pair.close) {
                    if (nesting === 0) return { start, end };
                    nesting--;
                }
                end++;
            }
        }
        return null;
    }

    let addCursorsInsideBrackets = vscode.commands.registerCommand('cursorgun.addCursorsInsideBrackets', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const selections = editor.selections.flatMap(selection => {
            const offset = editor.document.offsetAt(selection.active);
            const text = editor.document.getText();
            const pair = findBracketPair(text, offset);
            
            if (pair) {
                return [
                    new vscode.Selection(
                        editor.document.positionAt(pair.start + 1),
                        editor.document.positionAt(pair.start + 1)
                    ),
                    new vscode.Selection(
                        editor.document.positionAt(pair.end),
                        editor.document.positionAt(pair.end)
                    )
                ];
            }
            return [];
        });

        if (selections.length > 0) {
            editor.selections = selections;
        }
    });

    let addCursorsAroundBrackets = vscode.commands.registerCommand('cursorgun.addCursorsAroundBrackets', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const selections = editor.selections.flatMap(selection => {
            const offset = editor.document.offsetAt(selection.active);
            const text = editor.document.getText();
            const pair = findBracketPair(text, offset);
            
            if (pair) {
                return [
                    new vscode.Selection(
                        editor.document.positionAt(pair.start),
                        editor.document.positionAt(pair.start)
                    ),
                    new vscode.Selection(
                        editor.document.positionAt(pair.end + 1),
                        editor.document.positionAt(pair.end + 1)
                    )
                ];
            }
            return [];
        });

        if (selections.length > 0) {
            editor.selections = selections;
        }
    });

    // Select all regex matches
    let selectAtRegex = vscode.commands.registerCommand('cursorgun.selectAtRegex', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const inputBox = vscode.window.createInputBox();
        inputBox.prompt = "Enter regex pattern";
        inputBox.ignoreFocusOut = true;
        
        // Update previews as user types
        inputBox.onDidChangeValue(pattern => {
            try {
                if (!pattern) {
                    editor.setDecorations(cursorPreviewDecoration, []);
                    return;
                }

                const regex = new RegExp(pattern, 'g');
                const text = editor.document.getText(editor.selection) || editor.document.getText();
                const ranges: vscode.Range[] = [];
                const startOffset = editor.selection.isEmpty ? 0 : editor.document.offsetAt(editor.selection.start);
                
                let match;
                while ((match = regex.exec(text)) !== null) {
                    const startPos = editor.document.positionAt(startOffset + match.index);
                    const endPos = editor.document.positionAt(startOffset + match.index + match[0].length);
                    ranges.push(new vscode.Range(startPos, endPos));
                }

                editor.setDecorations(cursorPreviewDecoration, ranges);
            } catch (e) {
                // Invalid regex - clear previews
                editor.setDecorations(cursorPreviewDecoration, []);
            }
        });

        // Handle accept/cancel
        const pattern = await new Promise<string | undefined>(resolve => {
            inputBox.onDidAccept(() => {
                const value = inputBox.value;
                inputBox.hide();
                resolve(value);
            });
            inputBox.onDidHide(() => resolve(undefined));
            inputBox.show();
        });

        // Clear previews
        editor.setDecorations(cursorPreviewDecoration, []);
        
        if (!pattern) return;

        try {
            const regex = new RegExp(pattern, 'g');
            const text = editor.document.getText(editor.selection) || editor.document.getText();
            const selections: vscode.Selection[] = [];
            const startOffset = editor.selection.isEmpty ? 0 : editor.document.offsetAt(editor.selection.start);
            
            let match;
            while ((match = regex.exec(text)) !== null) {
                const startPos = editor.document.positionAt(startOffset + match.index);
                const endPos = editor.document.positionAt(startOffset + match.index + match[0].length);
                selections.push(new vscode.Selection(startPos, endPos));
            }

            if (selections.length > 0) {
                editor.selections = selections;
            }
        } catch (e) {
            vscode.window.showErrorMessage('Invalid regex pattern');
        }
    });

    context.subscriptions.push(
        addCursorsAtRegex,
        selectAtRegex,
        addCursorsAtChar,
        addCursorsAroundWord,
        addCursorsInsideBrackets,
        addCursorsAroundBrackets
    );

    // Display a welcome message
    vscode.window.showInformationMessage('Cursor Gun is now active!');
}

// This method is called when your extension is deactivated
export function deactivate() {}
