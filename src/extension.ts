import * as vscode from 'vscode';
import { initWorkTimeTracker, dispose } from './workTimeTracker';
import { activateExtensionManager } from './extensionManager';
import { generateReadmeContent } from './readmeTemplate';
import { createOrUpdateReadmeFile } from './utils';
import { CodeAnalyzer } from './analyzer';
import { CodeVisualizer } from './visualizer'; 

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "work-time-tracker" is now active!');

    initWorkTimeTracker(context);

    activateExtensionManager(context);

	let disposableReadme  = vscode.commands.registerCommand('extension.generateReadme', async () => {
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

    let disposableMetrics = vscode.commands.registerCommand('extension.analyzeCodeMetrics', async () => {
        const analyzer = new CodeAnalyzer();
        const visualizer = new CodeVisualizer();

        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const code = editor.document.getText();
            const metrics = analyzer.analyze(code);
            visualizer.showMetrics(metrics);
        } else {
            vscode.window.showErrorMessage('No active editor found!');
        }
    });
    
    context.subscriptions.push(disposableReadme, disposableMetrics);
}

export function deactivate() {
	dispose();
}
