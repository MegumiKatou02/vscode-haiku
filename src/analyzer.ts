export class CodeAnalyzer {
    analyze(code: string): CodeMetrics {
        const linesOfCode = this.countLinesOfCode(code);
        const cyclomaticComplexity = this.calculateCyclomaticComplexity(code);
        const numberOfFunctions = this.countFunctions(code);

        console.log('Analyzed Metrics:', { linesOfCode, cyclomaticComplexity, numberOfFunctions });

        return {
            linesOfCode,
            cyclomaticComplexity,
            numberOfFunctions,
        };
    }

    private countLinesOfCode(code: string): number {
        return code.split('\n').length;
    }

    private calculateCyclomaticComplexity(code: string): number {
        const complexityPatterns = [
            /if\s*\(/g,
            /for\s*\(/g,
            /while\s*\(/g,
            /switch\s*\(/g,
            /case\s+/g,
            /&&/g,
            /\|\|/g,
        ];
        let complexity = 1;
        complexityPatterns.forEach(pattern => {
            complexity += (code.match(pattern) || []).length;
        });
        return complexity;
    }

    private countFunctions(code: string): number {
        const functionPattern = /function\s+\w+\s*\(|function\s*\(/g;
        const functionMatches = (code.match(functionPattern) || []).length;

        const arrowFunctionPattern = /const\s+\w+\s*=\s*\([^)]*\)\s*=>|let\s+\w+\s*=\s*\([^)]*\)\s*=>|var\s+\w+\s*=\s*\([^)]*\)\s*=>/g;
        const arrowFunctionMatches = (code.match(arrowFunctionPattern) || []).length;

        const classMethodPattern = /class\s+\w+\s*{[^}]*\b\w+\s*\([^)]*\)\s*{/g;
        const classMethodMatches = (code.match(classMethodPattern) || []).length;

        return functionMatches + arrowFunctionMatches + classMethodMatches;
    }
}

export interface CodeMetrics {
    linesOfCode: number;
    cyclomaticComplexity: number;
    numberOfFunctions: number;
}