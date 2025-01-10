import * as vscode from 'vscode';
import { initWorkTimeTracker, dispose } from './workTimeTracker';
import { activateExtensionManager } from './extensionManager';
import { generateReadmeContent } from './readmeTemplate';
import { createOrUpdateReadmeFile } from './utils';

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "work-time-tracker" is now active!');

    initWorkTimeTracker(context);

    activateExtensionManager(context);

	let disposable = vscode.commands.registerCommand('extension.generateReadme', async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage("No workspace folder opened.");
            return;
        }

        const name = await vscode.window.showInputBox({ prompt: "Enter the project name" });
        const description = await vscode.window.showInputBox({ prompt: "Enter the project description" });
        const installation = await vscode.window.showInputBox({ prompt: "Enter the installation instructions" });
        const usage = await vscode.window.showInputBox({ prompt: "Enter usage instructions" });

        if (name && description && installation && usage) {
            const readmeContent = generateReadmeContent(name, description, installation, usage);
            await createOrUpdateReadmeFile(workspaceFolder.uri.fsPath, readmeContent);
            vscode.window.showInformationMessage("README.md file has been generated/updated.");
        }
    });

    context.subscriptions.push(disposable);	
}

export function deactivate() {
	dispose();
}
