import * as vscode from 'vscode';
import { initWorkTimeTracker, dispose } from './workTimeTracker';
import { activateExtensionManager } from './extensionManager';
import { generateReadmeContent } from './readmeTemplate';
import { createOrUpdateReadmeFile } from './utils';
import { CodeAnalyzer } from './analyzer';
import { CodeVisualizer } from './visualizer'; 

import { ComplexityAnalysis, Dependency } from './types';
import { analyzeLoops } from './analyzers/loopAnalyzer';
import { analyzeRecursion } from './analyzers/recursionAnalyzer';
import { analyzeMemoryUsage } from './analyzers/memoryAnalyzer';
import { showAnalysisResults } from './views/resultView';

import { NpmManager } from './managers/npmManager';
import { YarnManager } from './managers/yarnManager';
import { DependencyTreeProvider } from './views/dependencyTreeProvider';
import { DependencyItem } from './views/dependencyTreeProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "work-time-tracker" is now active!');

    initWorkTimeTracker(context);
    activateExtensionManager(context);

    let disposableReadme = vscode.commands.registerCommand('extension.generateReadme', async () => {
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

    let disposableComplexity = vscode.commands.registerCommand('extension.analyzeComplexity', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        if (editor.document.languageId !== 'cpp' && editor.document.languageId !== 'c') {
            vscode.window.showInformationMessage('This analysis is only available for C/C++ files');
            return;
        }

        const code = editor.document.getText();
        const analysis: ComplexityAnalysis = {
            timeComplexity: 'O(1)',
            spaceComplexity: 'O(1)',
            details: []
        };

        try {
            const loopResult = analyzeLoops(code);
            if (loopResult.complexity !== 'O(1)') {
                analysis.timeComplexity = loopResult.complexity;
                analysis.details.push(...loopResult.details);
            }

            const recursionResult = analyzeRecursion(code);
            if (recursionResult.isRecursive) {
                analysis.timeComplexity = recursionResult.complexity;
                analysis.details.push(...recursionResult.details);
            }

            const memoryResult = analyzeMemoryUsage(code);
            analysis.spaceComplexity = memoryResult.complexity;
            analysis.details.push(...memoryResult.details);

            showAnalysisResults(analysis);
        } catch (error) {
            vscode.window.showErrorMessage(`Analysis failed: ${(error as Error).message}`);
        }
    });

    // package manager
    const npmManager = new NpmManager();
    const yarnManager = new YarnManager();
    let dependencyProvider: DependencyTreeProvider;
    let dependencies: Dependency[] = [];
    let scanDependencies = vscode.commands.registerCommand('extension.scanDependencies', async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }

        try {
            const hasYarnLock = await vscode.workspace.findFiles('yarn.lock');
            dependencies = await (hasYarnLock.length > 0 ? 
                yarnManager.getDependencies(workspaceFolder.uri.fsPath) :
                npmManager.getDependencies(workspaceFolder.uri.fsPath));

            dependencyProvider = new DependencyTreeProvider(dependencies);
            vscode.window.createTreeView('dependenciesView', {
                treeDataProvider: dependencyProvider
            });

            const outdatedCount = dependencies.filter(d => d.isOutdated).length;
            vscode.window.showInformationMessage(
                `Found ${dependencies.length} dependencies, ${outdatedCount} outdated`
            );
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to scan dependencies: ${(error as Error).message}`);
        }
    });

    let updateDependency = vscode.commands.registerCommand('extension.updateDependency', async (depItem: DependencyItem) => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {return;}

        try {
            const hasYarnLock = await vscode.workspace.findFiles('yarn.lock');
            const manager = hasYarnLock.length > 0 ? yarnManager : npmManager;
            
            await manager.updateDependency(workspaceFolder.uri.fsPath, depItem.dependency.name);
            vscode.window.showInformationMessage(
                `Successfully updated ${depItem.dependency.name}`
            );
            
            vscode.commands.executeCommand('extension.scanDependencies');
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to update dependency: ${(error as Error).message}`);
        }
    });

    let updateAllDependencies = vscode.commands.registerCommand('extension.updateAllDependencies', async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {return;}

        try {
            const hasYarnLock = await vscode.workspace.findFiles('yarn.lock');
            const manager = hasYarnLock.length > 0 ? yarnManager : npmManager;
            
            await manager.updateAllDependencies(workspaceFolder.uri.fsPath);
            vscode.window.showInformationMessage('Successfully updated all dependencies');
            
            vscode.commands.executeCommand('extension.scanDependencies');
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to update dependencies: ${(error as Error).message}`);
        }
    });
    
    context.subscriptions.push(
        disposableReadme,
        disposableMetrics,
        disposableComplexity,
        scanDependencies,
        updateDependency,
        updateAllDependencies
    );
}

export function deactivate() {
    dispose();
}