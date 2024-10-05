import * as vscode from 'vscode';

type ApiResponse = {
 results: Array<{ text: string }>;
};

export class CodePhillerInlineCompletionItemProvider implements vscode.InlineCompletionItemProvider {
  /**
   * This method is called whenever the user types in the file.
   * It fetches code completion suggestions based on the current document content up to the cursor position.
   */
  async provideInlineCompletionItems(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.InlineCompletionList> {
    const textUpToCursor = document.getText(new vscode.Range(new vscode.Position(0, 0), position));
    console.log("Current text up to cursor:", textUpToCursor);

    let completionItems: vscode.InlineCompletionItem[] = [];

    try {
      const response = await fetch('http://127.0.0.1:3000/api/v1/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textUpToCursor }),
      });

      const json = await response.json() as ApiResponse;
      const predictions = json.results;
      completionItems = predictions.map(prediction => {
        return new vscode.InlineCompletionItem(prediction.text, new vscode.Range(position, position));
      });

    } catch (err) {
      console.error('Error while calling AI API:', err);
    }

    console.log(completionItems);
    return { items: completionItems };
  }

}

export function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage('CodePhiller activated for Python files!', { modal: true });
  const provider = new CodePhillerInlineCompletionItemProvider();
  context.subscriptions.push(vscode.languages.registerInlineCompletionItemProvider({ scheme: 'file', language: 'python' }, provider));
}

export function deactivate() { }
