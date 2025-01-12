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
        const arrowFunctionPattern = /(const|let|var)\s+\w+\s*=\s*\([^)]*\)\s*=>|\([^)]*\)\s*=>/g; 
        const asyncFunctionPattern = /async\s+function\s+\w+\s*\(|async\s+function\s*\(|async\s+\([^)]*\)\s*=>/g; 
        const generatorFunctionPattern = /function\*\s+\w+\s*\(|function\*\s*\(/g; 
        
        const classMethodPattern = /\b\w+\s*\([^)]*\)\s*{/g; 
        const getterSetterPattern = /\b(get|set)\s+\w+\s*\([^)]*\)\s*{/g;
        const es6ObjectMethodPattern = /\b\w+\s*\([^)]*\)\s*{/g;
    
        const functionMatches = (code.match(functionPattern) || []).length;
        const arrowFunctionMatches = (code.match(arrowFunctionPattern) || []).length;
        const asyncFunctionMatches = (code.match(asyncFunctionPattern) || []).length;
        const generatorFunctionMatches = (code.match(generatorFunctionPattern) || []).length;
        
        const classMethodMatches = (code.match(classMethodPattern) || []).length;
        const getterSetterMatches = (code.match(getterSetterPattern) || []).length;
        const es6ObjectMethodMatches = (code.match(es6ObjectMethodPattern) || []).length;
    
        return (
            functionMatches +
            arrowFunctionMatches +
            asyncFunctionMatches +
            generatorFunctionMatches +
            classMethodMatches +
            getterSetterMatches +
            es6ObjectMethodMatches
        );
    }    
}

export interface CodeMetrics {
    linesOfCode: number;
    cyclomaticComplexity: number;
    numberOfFunctions: number;
}