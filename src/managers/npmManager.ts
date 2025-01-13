import * as vscode from 'vscode';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Dependency, PackageInfo } from '../types';

const execAsync = promisify(exec);

export class NpmManager {
    async getDependencies(workspacePath: string): Promise<Dependency[]> {
        try {
            const packageJson = require(path.join(workspacePath, 'package.json'));
            const dependencies: Dependency[] = [];

            const allDeps = {
                ...packageJson.dependencies,
                ...packageJson.devDependencies
            };

            for (const [name, version] of Object.entries(allDeps)) {
                const currentVersion = (version as string).replace('^', '').replace('~', '');
                const latestVersion = await this.getLatestVersion(name);
                
                dependencies.push({
                    name,
                    currentVersion,
                    latestVersion,
                    isOutdated: currentVersion !== latestVersion
                });
            }

            return dependencies;
        } catch (error) {
            throw new Error(`Failed to get dependencies: ${(error as Error).message}`);
        }
    }

    private async getLatestVersion(packageName: string): Promise<string> {
        try {
            const { stdout } = await execAsync(`npm show ${packageName} version`);
            return stdout.trim();
        } catch (error) {
            return 'unknown';
        }
    }

    async updateDependency(workspacePath: string, dependency: string): Promise<void> {
        try {
            await execAsync(`npm update ${dependency}`, { cwd: workspacePath });
        } catch (error) {
            throw new Error(`Failed to update ${dependency}: ${(error as Error).message}`);
        }
    }

    async updateAllDependencies(workspacePath: string): Promise<void> {
        try {
            await execAsync('npm update', { cwd: workspacePath });
        } catch (error) {
            throw new Error(`Failed to update dependencies: ${(error as Error).message}`);
        }
    }
}