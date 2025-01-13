import * as vscode from 'vscode';
import { Dependency } from '../types';

export class DependencyTreeProvider implements vscode.TreeDataProvider<DependencyItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<DependencyItem | undefined | null | void> = new vscode.EventEmitter<DependencyItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<DependencyItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(private dependencies: Dependency[]) {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: DependencyItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: DependencyItem): Thenable<DependencyItem[]> {
        if (element) {
            return Promise.resolve([]);
        }

        return Promise.resolve(
            this.dependencies.map(dep => new DependencyItem(dep))
        );
    }
}

export class DependencyItem extends vscode.TreeItem {
    constructor(public dependency: Dependency) {
        super(
            dependency.name,
            vscode.TreeItemCollapsibleState.None
        );

        this.tooltip = `${dependency.name}@${dependency.currentVersion}`;
        this.description = `${dependency.currentVersion} → ${dependency.latestVersion}`;
        
        if (dependency.isOutdated) {
            this.iconPath = new vscode.ThemeIcon('warning');
        }
    }
}