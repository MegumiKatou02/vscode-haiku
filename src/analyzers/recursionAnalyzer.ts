import { RecursionAnalysis } from '../types';

export function analyzeRecursion(code: string): RecursionAnalysis {
    const result = {
        isRecursive: false,
        complexity: 'O(1)',
        details: [] as string[]
    };

    const functionRegex = /\w+\s+(\w+)\s*\([^)]*\)\s*{/g;
    const functions = Array.from(code.matchAll(functionRegex), m => m[1]);

    for (const func of functions) {
        const functionBody = extractFunctionBody(code, func);
        if (functionBody && functionBody.includes(func)) {
            result.isRecursive = true;
            result.complexity = 'O(2^n)';
            result.details.push(`Phát hiện hàm đệ quy: ${func}`);
        }
    }

    return result;
}

function extractFunctionBody(code: string, functionName: string): string | null {
    const regex = new RegExp(`\\w+\\s+${functionName}\\s*\\([^)]*\\)\\s*{([^}]*)}`, 'g');
    const match = regex.exec(code);
    return match ? match[1] : null;
}