// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
import * as vscode from 'vscode';

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

        const pattern = await vscode.window.showInputBox({
            prompt: "Enter regex pattern"
        });
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

        const char = await vscode.window.showInputBox({
            prompt: "Enter character to match",
            placeHolder: "Single character"
        });
        if (!char || char.length !== 1) return;

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

    context.subscriptions.push(
        addCursorsAtRegex,
        addCursorsAtChar,
        addCursorsAroundWord,
        addCursorsInsideBrackets,
        addCursorsAroundBrackets
    );
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from CursorGun!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
