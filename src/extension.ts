// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import getClassesMap from "./getClassesMap";
import { languages } from "./lib/languages";
import sortTailwind from "./sortTailwind";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("tailwindSorter.sort", sortOnCommand),
    vscode.workspace.onWillSaveTextDocument(sortOnSave)
  );
}

export async function sortOnCommand() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const document = editor.document;
  if (!languages.includes(document.languageId)) {
    vscode.window.showWarningMessage(
      `Tailwind Sorter: Language ${document.languageId} is not supported`
    );
    return;
  }

  const { classesMap, pseudoSortOrder } = getClassesMap();

  const text = document.getText();
  const sortedTailwind = sortTailwind(text, classesMap, pseudoSortOrder);

  await editor.edit((editBuilder) => {
    editBuilder.replace(
      new vscode.Range(
        document.positionAt(0),
        document.positionAt(text.length)
      ),
      sortedTailwind
    );
  });
}

export function sortOnSave(event: vscode.TextDocumentWillSaveEvent) {
  const config = vscode.workspace.getConfiguration("tailwindSorter");
  const sortOnSave = config.get<boolean>("sortOnSave", true);

  if (!sortOnSave || !languages.includes(event.document.languageId)) {
    return;
  }

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

// This method is called when your extension is deactivated
export function deactivate() {}
