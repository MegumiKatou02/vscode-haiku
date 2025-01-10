import * as vscode from 'vscode';

let timer: NodeJS.Timeout | undefined;
let startTime: number | undefined;
let elapsedTime: number = 0;
let statusBarItem: vscode.StatusBarItem;
let isPaused: boolean = false;

export function initWorkTimeTracker(context: vscode.ExtensionContext) {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.text = 'Work Time: 00h 00m 00s';
    statusBarItem.tooltip = 'Click to pause/resume';
    statusBarItem.command = 'workTimeTracker.pauseResume';
    statusBarItem.show();

    startTimer();

    const pauseResumeCommand = vscode.commands.registerCommand('workTimeTracker.pauseResume', () => {
        if (isPaused) {
            startTimer();
        } else {
            pauseTimer();
        }
    });

    context.subscriptions.push(pauseResumeCommand, statusBarItem);
}

function startTimer() {
    if (isPaused) {
        startTime = Date.now() - elapsedTime;
    } else {
        startTime = Date.now();
    }
    isPaused = false;

    timer = setInterval(() => {
        if (startTime) {
            const currentElapsedTime = Date.now() - startTime;
            const seconds = Math.floor(currentElapsedTime / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const displayTime = `${hours}h ${minutes % 60}m ${seconds % 60}s`;

            statusBarItem.text = `Work Time: ${displayTime}`;
        }
    }, 1000);
}

function pauseTimer() {
    if (timer) {
        clearInterval(timer);
        timer = undefined;
    }
    if (startTime) {
        elapsedTime = Date.now() - startTime;
    }
    isPaused = true;
    statusBarItem.text = 'Work Time: Paused';
}

export function dispose() {
    if (timer) {
        clearInterval(timer);
    }
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}
