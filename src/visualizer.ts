import * as vscode from 'vscode';
import { CodeMetrics } from './analyzer';

export class CodeVisualizer {
    showMetrics(metrics: CodeMetrics) {
        const message = `Code Metrics:
- Lines of Code: ${metrics.linesOfCode}
- Cyclomatic Complexity: ${metrics.cyclomaticComplexity}
- Number of Functions: ${metrics.numberOfFunctions}`;

        vscode.window.showInformationMessage(message);

        this.showChart(metrics);
    }

    private showChart(metrics: CodeMetrics) {
        const panel = vscode.window.createWebviewPanel(
            'codeMetricsChart',
            'Code Metrics Chart',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true
            }
        );

        const chartData = {
            labels: ['Lines of Code', 'Cyclomatic Complexity', 'Number of Functions'],
            datasets: [{
                label: 'Code Metrics',
                data: [metrics.linesOfCode, metrics.cyclomaticComplexity, metrics.numberOfFunctions],
                backgroundColor: ['#36a2eb', '#ff6384', '#cc65fe'],
            }]
        };

        panel.webview.html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Code Metrics Chart</title>
                <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background-color: #f5f5f5;
                    }
                    canvas {
                        max-width: 100%;
                        max-height: 100%;
                    }
                </style>
            </head>
            <body>
                <canvas id="metricsChart"></canvas>
                <script>
                    const ctx = document.getElementById('metricsChart').getContext('2d');
                    const chart = new Chart(ctx, {
                        type: 'bar',
                        data: ${JSON.stringify(chartData)},
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                </script>
            </body>
            </html>
        `;
    }
}