export interface ComplexityAnalysis {
    timeComplexity: string;
    spaceComplexity: string;
    details: string[];
}

export interface LoopAnalysis {
    complexity: string;
    details: string[];
}

export interface RecursionAnalysis {
    isRecursive: boolean;
    complexity: string;
    details: string[];
}

export interface MemoryAnalysis {
    complexity: string; 
    details: string[];
}

export interface Dependency {
    name: string;
    currentVersion: string;
    latestVersion: string;
    isOutdated: boolean;
}

export interface PackageInfo {
    dependencies: { [key: string]: string };
    devDependencies: { [key: string]: string };
}