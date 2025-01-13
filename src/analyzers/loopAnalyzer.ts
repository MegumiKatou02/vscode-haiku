import { LoopAnalysis } from '../types';

export function analyzeLoops(code: string): LoopAnalysis {
    const result = {
        complexity: 'O(1)',
        details: [] as string[]
    };

    const lines = code.split('\n');
    let maxNesting = 0;
    let currentNesting = 0;

    for (const line of lines) {
        if (line.match(/for|while/)) {
            currentNesting++;
            maxNesting = Math.max(maxNesting, currentNesting);
        }
        if (line.includes('}')) {
            currentNesting = Math.max(0, currentNesting - 1);
        }
    }

    if (maxNesting > 0) {
        result.complexity = `O(n^${maxNesting})`;
        result.details.push(`Phát hiện ${maxNesting} vòng lặp lồng nhau`);
    }

    return result;
}