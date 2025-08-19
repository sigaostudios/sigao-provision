# Claude Code CLI - AI Pair Programming

The official Claude CLI for using Claude as an AI coding assistant.

## Usage

```bash
# Interactive mode
claude

# Process a single prompt
claude "Explain this Python code"

# Continue previous conversation
claude --resume

# Extended thinking mode
claude --thinking

# Web search integration
claude --web
```

## Description

Claude Code CLI is a command-line interface that brings Claude's AI capabilities directly to your terminal. It's designed for developers who want to:

- Get code explanations and reviews
- Generate code snippets and functions
- Debug issues with AI assistance
- Refactor and improve existing code
- Learn new programming concepts

## Installation

The Claude CLI is installed automatically by Sigao:
```bash
npm install -g @anthropic/claude-cli
```

## Examples

### Interactive Coding Session
```bash
claude
# Start an interactive session where you can:
# - Ask questions about code
# - Request code generation
# - Get debugging help
# - Discuss architecture decisions
```

### Code Review
```bash
# Paste code and ask for review
claude "Review this function for potential issues"
```

### Extended Thinking
```bash
# For complex problems requiring deeper analysis
claude --thinking "Design a scalable microservices architecture"
```

### Resume Previous Session
```bash
# Continue where you left off
claude --resume
```

## Key Features

- **Context Awareness**: Maintains conversation context
- **Code Understanding**: Analyzes and explains code in multiple languages
- **Generation**: Creates code snippets, functions, and entire modules
- **Debugging**: Helps identify and fix bugs
- **Best Practices**: Suggests improvements and optimizations
- **Learning**: Explains concepts and provides examples

## Tips & Tricks

### Working with Files
```bash
# Ask about a specific file
cat myfile.py | claude "Explain what this code does"

# Generate tests for a function
claude "Write unit tests for the function in myfile.js"
```

### Project Context
```bash
# Provide project context
claude "I'm working on a React app with TypeScript. How do I..."
```

### Iterative Development
```bash
# Start with high-level design
claude "Design a REST API for a blog platform"

# Then dive into specifics
claude "Implement the user authentication endpoint"
```

## Configuration

Claude CLI configuration is stored in `~/.config/claude/`:
- API keys and authentication
- Preferences and settings
- Conversation history

## Best Practices

1. **Be Specific**: Provide clear, detailed prompts
2. **Include Context**: Mention language, framework, and requirements
3. **Iterate**: Build on previous responses
4. **Verify**: Always review and test generated code
5. **Learn**: Ask for explanations to understand the code

## Common Use Cases

- **Code Generation**: "Create a Python function that..."
- **Debugging**: "Why is this code throwing an error?"
- **Refactoring**: "How can I improve this code?"
- **Learning**: "Explain how async/await works"
- **Architecture**: "Design a system that..."

## Related Commands

- `sigao work` - Automate development with workpackages
- `git` - Version control for your code
- `gh` - GitHub integration

## See Also

- Claude documentation: https://docs.anthropic.com/
- `sigao help work` - Workpackage automation
- `sigao help sigao` - Sigao CLI overview