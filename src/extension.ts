// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import getClassesMap from "./getClassesMap";
import sortTailwind from "./sortTailwind";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "tailwind-sorter.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from tailwind-sorter!");
    }
  );

  context.subscriptions.push(disposable);

  let sortDisposable = vscode.workspace.onWillSaveTextDocument((event) => {
    const languages = ["html", "vue", "jsx", "tsx", "javascript", "typescript"];

    if (languages.includes(event.document.languageId)) {
      // get current configuration settings
      const sortConfig = getClassesMap();

      // get css from file and sort
      const text = event.document.getText();
      const sortedTailwind = sortTailwind(text, sortConfig);

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
