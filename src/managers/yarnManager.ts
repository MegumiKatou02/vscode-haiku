import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Dependency } from '../types';

const execAsync = promisify(exec);

export class YarnManager {
    async getDependencies(workspacePath: string): Promise<Dependency[]> {
        try {
            const { stdout } = await execAsync('yarn outdated --json', { cwd: workspacePath });
            const outdatedDeps = JSON.parse(stdout);
            
            return outdatedDeps.data.body.map((dep: any) => ({
                name: dep.name,
                currentVersion: dep.current,
                latestVersion: dep.latest,
                isOutdated: dep.current !== dep.latest
            }));
        } catch (error) {
            throw new Error(`Failed to get dependencies: ${(error as Error).message}`);
        }
    }

    async updateDependency(workspacePath: string, dependency: string): Promise<void> {
        try {
            await execAsync(`yarn upgrade ${dependency}`, { cwd: workspacePath });
        } catch (error) {
            throw new Error(`Failed to update ${dependency}: ${(error as Error).message}`);
        }
    }

    async updateAllDependencies(workspacePath: string): Promise<void> {
        try {
            await execAsync('yarn upgrade', { cwd: workspacePath });
        } catch (error) {
            throw new Error(`Failed to update dependencies: ${(error as Error).message}`);
        }
    }
}