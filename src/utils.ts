import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

/**
 * @param folderPath 
 * @param content 
 */
export async function createOrUpdateReadmeFile(folderPath: string, content: string) {
    const readmePath = path.join(folderPath, 'README.md');

    try {
        await fs.promises.writeFile(readmePath, content, 'utf8');
    } catch (error) {
        vscode.window.showErrorMessage("Error writing README.md: " + (error as Error).message);
    }
}
