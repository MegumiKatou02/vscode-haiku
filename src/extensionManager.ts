import * as vscode from 'vscode';

export function activateExtensionManager(context: vscode.ExtensionContext) {
    console.log('Extension Manager is now active!');

    const openManagerCommand = vscode.commands.registerCommand('extensionManager.open', () => {
        const panel = vscode.window.createWebviewPanel(
            'extensionManager',
            'Extension Manager',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
            }
        );

        panel.webview.html = getWebviewContent(panel.webview);

        panel.webview.onDidReceiveMessage(
            async (message) => {
                switch (message.command) {
                    case 'toggleExtension':
                        await toggleExtension(message.id, message.isActive, panel);
                        break;
                }
            },
            undefined,
            context.subscriptions
        );
    });

    context.subscriptions.push(openManagerCommand);
}

async function toggleExtension(extensionId: string, isActive: boolean, panel: vscode.WebviewPanel) {
    const extension = vscode.extensions.getExtension(extensionId);
    if (extension) {
        try {
            const isCurrentlyActive = extension.isActive;
            if (isActive !== isCurrentlyActive) {
                if (isActive) {
                    await vscode.commands.executeCommand('workbench.extensions.enableExtension', extensionId);
                } else {
                    await vscode.commands.executeCommand('workbench.extensions.disableExtension', extensionId);
                }

                panel.webview.postMessage({
                    command: 'toggleExtensionResponse',
                    id: extensionId,
                    isActive: !isActive,
                });
            }
        } catch (error) {
            panel.webview.postMessage({
                command: 'toggleExtensionError',
                id: extensionId,
                error: (error as Error).message || 'Unknown error occurred.',
            });
        }
    }
}

function getWebviewContent(webview: vscode.Webview): string {
    const extensions = vscode.extensions.all;
    const style = `
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; background-color: #f0f0f0; }
            ul { list-style-type: none; padding: 0; }
            li {
                margin: 10px 0;
                padding: 10px;
                background-color: #ffffff;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                font-size: 16px;
            }
            li:hover {
                background-color: #e0e0e0;
            }
            button {
                margin-left: 10px;
                padding: 5px 10px;
                background-color: #0078d4;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.3s;
            }
            button:hover {
                background-color: #005a9e;
            }
            button:disabled {
                background-color: #ddd;
                cursor: not-allowed;
            }
            #loading {
                font-size: 14px;
                color: #0078d4;
            }
        </style>
    `;

    const script = `
        <script>
            function toggleExtension(id, isActive) {
                const button = document.getElementById('btn-' + id);
                const loadingText = document.getElementById('loading-' + id);
                const labelText = document.getElementById('label-' + id);

                loadingText.style.display = 'inline';
                labelText.style.display = 'none';
                button.disabled = true;

                window.postMessage({
                    command: 'toggleExtension',
                    id: id,
                    isActive: isActive
                });
            }

            window.addEventListener('message', event => {
                const message = event.data;
                if (message.command === 'toggleExtensionResponse') {
                    const button = document.getElementById('btn-' + message.id);
                    const loadingText = document.getElementById('loading-' + message.id);
                    const labelText = document.getElementById('label-' + message.id);

                    loadingText.style.display = 'none';
                    labelText.style.display = 'inline';
                    button.disabled = false;
                    button.textContent = message.isActive ? 'Disable' : 'Enable';
                }

                if (message.command === 'toggleExtensionError') {
                    const button = document.getElementById('btn-' + message.id);
                    button.disabled = false;
                    button.textContent = 'Error';
                    alert(message.error);
                }
            });
        </script>
    `;

    let html = `<html><head>${style}${script}</head><body><h1>Extension Manager</h1><ul>`;

    extensions.forEach(extension => {
        const isActive = extension.isActive;
        html += `
            <li>
                ${extension.id} - ${extension.packageJSON.version}
                <button id="btn-${extension.id}" onclick="toggleExtension('${extension.id}', ${isActive})">
                    <span id="loading-${extension.id}" style="display: none;">Loading...</span>
                    <span id="label-${extension.id}">${isActive ? 'Disable' : 'Enable'}</span>
                </button>
            </li>
        `;
    });

    html += `</ul></body></html>`;
    return html;
}
