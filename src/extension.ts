// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import getClassesMap from "./getClassesMap";
import sortTailwind from "./sortTailwind";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let sortDisposable = vscode.workspace.onWillSaveTextDocument((event) => {
    const languages = [
      "html",
      "php",
      "vue",
      "javascriptreact",
      "typescriptreact",
      "elixir",
      "phoenix-heex",
      "svelte",
      "twig",
      "astro",
      "rust",
      "css",
      "scss",
    ];

    if (languages.includes(event.document.languageId)) {
      const { classesMap, pseudoSortOrder } = getClassesMap();

      const text = event.document.getText();
      const sortedTailwind = sortTailwind(text, classesMap, pseudoSortOrder);

      // onWillSave + waitUntil prevents looping
      event.waitUntil(
        Promise.resolve([
          new vscode.TextEdit(
            new vscode.Range(
              event.document.positionAt(0),
              event.document.positionAt(text.length)
            ),
            sortedTailwind
          ),
        ])
      );
    }
  });

  context.subscriptions.push(sortDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
