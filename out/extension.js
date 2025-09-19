"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const PINS_KEY = 'pinup.pinnedImages';
function activate(context) {
    console.log('PinUp Gallery is active!');
    // Get already pinned ones for global state;
    const savedPins = context.globalState.get(PINS_KEY, []);
    const provider = new PinUpGalleryProvider(context.extensionUri, context);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider('pinUpGalleryView', provider));
    context.subscriptions.push(vscode.commands.registerCommand('pinUpGallery.openImage', (imagePath) => {
        openImagePanel(context.extensionUri, imagePath);
    }));
    // Restore pins after launching
    savedPins.forEach(img => createPinnedPanel(context, context.extensionUri, img));
}
function openImagePanel(extensionUri, imagePath) {
    const panel = vscode.window.createWebviewPanel('pinupImage', `PinUp – ${path.basename(imagePath)}`, vscode.ViewColumn.Beside, { enableScripts: false });
    // Important: create webview path from file path
    const webUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, imagePath));
    panel.webview.html = `
        <!DOCTYPE html>
        <html>
        <body style="margin:0; background:#1e1e1e; display:flex; justify-content:center; align-items:center;">
            <img src="${webUri}" style="max-width:100%; height:auto;" />
        </body>
        </html>`;
}
function createPinnedPanel(context, extensionUri, imagePath) {
    const panel = vscode.window.createWebviewPanel('pinUpPinnedImage', `Pin: ${path.basename(imagePath)}`, vscode.ViewColumn.Beside, { enableScripts: false });
    const imgUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, imagePath));
    panel.webview.html = `
        <!DOCTYPE html>
        <html>
        <body style="margin:0; background:#1e1e1e; display:flex; justify-content:center; align-items:center;">
            <img src="${imgUri}" style="max-width:100%; height:auto;" />
        </body>
        </html>`;
    const current = context.globalState.get(PINS_KEY, []);
    if (!current.includes(imagePath)) {
        context.globalState.update(PINS_KEY, [...current, imagePath]);
    }
    panel.onDidDispose(() => {
        const left = context.globalState.get(PINS_KEY, []).filter(p => p !== imagePath);
        context.globalState.update(PINS_KEY, left);
    });
}
class PinUpGalleryProvider {
    constructor(_extensionUri, _context) {
        this._extensionUri = _extensionUri;
        this._context = _context;
        this._media_by_category = this._scanMedia();
        ;
    }
    _scanMedia() {
        const mediaPath = path.join(this._extensionUri.fsPath, 'media');
        const groups = {
            'Beauty': [],
            'For Senior Developers': [],
            'True men': []
        };
        const files = fs.readdirSync(mediaPath);
        for (const file of files) {
            if (fs.statSync(path.join(mediaPath, file)).isDirectory())
                continue;
            const lower = file.toLowerCase();
            if (lower.startsWith('beauty_')) {
                groups['Beauty'].push(`media/${file}`);
            }
            else if (lower.startsWith('senior_')) {
                groups['For Senior Developers'].push(`media/${file}`);
            }
            else if (lower.startsWith('true_')) {
                groups['True men'].push(`media/${file}`);
            }
        }
        return groups;
    }
    resolveWebviewView(webviewView, context, token) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case 'openImageContainer':
                    console.log("Received openImageContainer event");
                    createPinnedPanel(this._context, this._extensionUri, message.imageUrl);
                    break;
            }
        });
    }
    _getHtmlForWebview(webview) {
        const htmlPath = path.join(this._extensionUri.fsPath, 'templates', 'index.html');
        let html = fs.readFileSync(htmlPath, 'utf8');
        const allImages = Object.values(this._media_by_category).flat();
        const imageElements = allImages.map(img => {
            const imgUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, img));
            return `
                <div class="image-card" data-url="${img}">
                    <img src="${imgUri}" style="width:100%;height:auto;object-fit:cover">
                </div>`;
        }).join('');
        return html
            .replace('${categorySelects}', '')
            .replace('${imageElements}', imageElements);
    }
}
;
//# sourceMappingURL=extension.js.map