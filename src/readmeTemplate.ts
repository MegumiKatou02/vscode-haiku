export function generateReadmeContent(name: string, description: string, installation: string, usage: string): string {
    return `# ${name}

## Description
${description}

## Installation
\`\`\`
${installation}
\`\`\`

## Usage
\`\`\`
${usage}
\`\`\`

## Contributing
Feel free to fork the project, create a pull request, or report issues.

## License
This project is licensed under the MIT License.
`;
}
