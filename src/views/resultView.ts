import * as vscode from 'vscode';
import { ComplexityAnalysis } from '../types';

export function showAnalysisResults(analysis: ComplexityAnalysis) {
    const panel = vscode.window.createWebviewPanel(
        'complexityAnalysis',
        'C++ Complexity Analysis',
        vscode.ViewColumn.Beside,
        { enableScripts: true }
    );

    panel.webview.html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { 
                    padding: 20px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell;
                }
                .result {
                    margin-bottom: 20px;
                    padding: 15px;
                    background-color: #f5f5f5;
                    border-radius: 5px;
                }
                .complexity {
                    font-size: 1.2em;
                    font-weight: bold;
                    color: #2c3e50;
                }
            </style>
        </head>
        <body>
            <h2>Phân tích độ phức tạp thuật toán C++</h2>
            <div class="result">
                <div class="complexity">
                    Độ phức tạp thời gian: ${analysis.timeComplexity}
                </div>
            </div>
            <div class="result">
                <div class="complexity">
                    Độ phức tạp không gian: ${analysis.spaceComplexity}
                </div>
            </div>
            <div class="result">
                <h3>Chi tiết phân tích:</h3>
                <ul>
                    ${analysis.details.map(detail => `<li>${detail}</li>`).join('')}
                </ul>
            </div>
        </body>
        </html>
    `;
}