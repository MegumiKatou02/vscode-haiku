import { MemoryAnalysis } from '../types';

export function analyzeMemoryUsage(code: string): MemoryAnalysis {
    const result = {
        complexity: 'O(1)',
        details: [] as string[]
    };

    if (code.includes('vector<') || code.includes('list<')) {
        result.complexity = 'O(n)';
        result.details.push('Sử dụng cấu trúc dữ liệu động (vector/list)');
    }

    if (code.includes('new ') || code.includes('malloc(')) {
        result.complexity = 'O(n)';
        result.details.push('Sử dụng cấp phát bộ nhớ động');
    }

    return result;
}