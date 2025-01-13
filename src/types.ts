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