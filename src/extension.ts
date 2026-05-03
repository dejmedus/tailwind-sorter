// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import type { SortOptions } from "./types";

import getClassesMap from "./getClassesMap";
import getLanguages, { normalize } from "./lib/languages";
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
  const languages = getLanguages();

  if (!languages.includes(document.languageId)) {
    vscode.window.showWarningMessage(
      `Tailwind Sorter: Language ${document.languageId} is not supported`
    );
    return;
  }

  const text = document.getText();

  const config = vscode.workspace.getConfiguration("tailwindSorter");
  const useOfficialSort = config.get<boolean>("useOfficialSort", false);

  const sortedTailwind = await sort(text, useOfficialSort);

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
  const ignorePaths = config.get<string[]>("ignorePaths", []);
  const languages = getLanguages();

  const shouldIgnoreFile = ignorePaths.some(
    (path) =>
      vscode.languages.match({ pattern: normalize(path) }, event.document) > 0
  );

  if (
    !sortOnSave ||
    shouldIgnoreFile ||
    !languages.includes(event.document.languageId)
  ) {
    return;
  }

  const text = event.document.getText();

  const useOfficialSort = config.get<boolean>("useOfficialSort", false);

  event.waitUntil(
    sort(text, useOfficialSort).then((sortedTailwind) => [
      new vscode.TextEdit(
        new vscode.Range(
          event.document.positionAt(0),
          event.document.positionAt(text.length)
        ),
        sortedTailwind
      )
    ])
  );
}

/**
 * Sort tailwind classes
 *
 * @param text file text containing tailwind classes to sort
 * @param useOfficialSort whether or not to override native sort
 * @returns sorted file text
 */
async function sort(text: string, useOfficialSort: boolean): Promise<string> {
  if (useOfficialSort) {
    try {
      return sortTailwind(text, {
        mode: "official",
        sorter: await getOfficialSorter()
      });
    } catch {
      return text;
    }
  }

  return sortTailwind(text, { mode: "extension", ...getClassesMap() });
}

// Public sorting api exposed by prettier-plugin-tailwindcss
// https://github.com/tailwindlabs/prettier-plugin-tailwindcss/pull/438
export let officialSorterPromise: Promise<any> | null = null;
export function getOfficialSorter() {
  if (!officialSorterPromise) {
    officialSorterPromise = import("prettier-plugin-tailwindcss/sorter")
      .then(({ createSorter }) => createSorter({}))
      .catch(() => {
        officialSorterPromise = null;
        vscode.window.showWarningMessage(
          "Tailwind Sorter: Failed to load official sorter, file was not sorted."
        );
        throw new Error("Failed to load official sorter");
      });
  }
  return officialSorterPromise;
}

// Test helper
export function resetOfficialSorterPromise() {
  officialSorterPromise = null;
}

// This method is called when your extension is deactivated
export function deactivate() {}
