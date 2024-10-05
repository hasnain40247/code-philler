/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WizardCoderInlineCompletionItemProvider = void 0;
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(__webpack_require__(1));
class WizardCoderInlineCompletionItemProvider {
    // This method is called whenever the user types in the file.
    async provideInlineCompletionItems(document, position) {
        // Get the text in the document up to the current cursor position
        const textUpToCursor = document.getText(new vscode.Range(new vscode.Position(0, 0), position));
        console.log("Current text up to cursor:", textUpToCursor);
        let completionItems = [];
        try {
            const response = await fetch('http://127.0.0.1:3000/api/v1/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: textUpToCursor }),
            });
            const json = await response.json();
            const predictions = json.results;
            completionItems = predictions.map(prediction => {
                return new vscode.InlineCompletionItem(prediction.text, new vscode.Range(position, position));
            });
        }
        catch (err) {
            console.error('Error while calling AI API:', err);
        }
        console.log(completionItems);
        return { items: completionItems };
    }
    // Simulate fetching a response from an external API or service
    async fetchCompletionResponse(text) {
        // You can replace this with an actual API call.
        // For now, let's simulate a response based on the input text.
        const dummyResponses = [
            { text: 'import os' },
            { text: 'import sys' },
            { text: 'def main():' },
            { text: 'print("Hello World")' }
        ];
        // Filtering dummy responses based on the text up to the cursor
        const filteredResponses = dummyResponses.filter(response => response.text.startsWith(text));
        return { results: filteredResponses };
    }
}
exports.WizardCoderInlineCompletionItemProvider = WizardCoderInlineCompletionItemProvider;
function activate(context) {
    vscode.window.showInformationMessage('WizardCoder activated for Python files!', { modal: true });
    const provider = new WizardCoderInlineCompletionItemProvider();
    // Register the inline completion item provider for Python files
    context.subscriptions.push(vscode.languages.registerInlineCompletionItemProvider({ scheme: 'file', language: 'python' }, provider));
}
function deactivate() { }


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map