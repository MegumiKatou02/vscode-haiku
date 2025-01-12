# My VS Code Extension

## Installation

1. **Clone the repository** (if you haven't already):
   ```sh
   git clone https://github.com/MegumiKatou02/vscode-haiku.git
   cd vscode-haiku
   ```
2. **Install dependencies**:
   ```sh
   npm install
   ```
3. **Build the extension** (if needed):
   ```sh
   npm run compile
   ```
4. **Launch the extension in VS Code**:
   - Open the extension folder in VS Code.
   - Press `F5` to start a new VS Code window with the extension loaded.

## Running the Extension

- Open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) and search for your extension's command.
- Select and execute the command to see the extension in action.

## Debugging

- Set breakpoints in your code (e.g., in `src/extension.ts`).
- Use `F5` to start debugging.
- Check the Debug Console for output and logs.

## Testing

1. Run the test task:
   ```sh
   npm test
   ```
2. Open the Testing view in VS Code and run tests manually.

## Publishing

- Follow [this guide](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) to publish your extension to the VS Code Marketplace.

---

For additional details, refer to the [VS Code Extension API](https://code.visualstudio.com/api).

