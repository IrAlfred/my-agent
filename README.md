# AI-Powered Code Review Agent

An intelligent code review agent that analyzes git changes, generates meaningful commit messages, and produces comprehensive code reviews saved to markdown files. Built with TypeScript, Bun, and Google's Gemini AI.

## ✨ Features

- **🤖 AI-Powered Code Analysis**: Uses Google's Gemini AI to analyze code changes and provide intelligent feedback
- **📝 Commit Message Generation**: Automatically generates conventional commit messages based on code diffs
- **📋 Markdown Code Reviews**: Creates detailed code review reports saved to markdown files
- **🔍 Git Integration**: Seamlessly analyzes git diffs and staged/unstaged changes
- **🛠️ Modular Tool Architecture**: Built with composable AI tools for extensibility
- **⚡ Fast Performance**: Powered by Bun runtime for quick execution

## 🚀 Quick Start

### Installation

```bash
bun install
```

### Basic Usage

```bash
bun run index.ts
```

The agent will:
1. 🔍 Analyze git changes in your repository
2. 🤖 Generate a descriptive commit message
3. 📋 Create a comprehensive code review
4. 💾 Save the review to `review.md`

## 🏗️ Architecture

### Core Components

- **`index.ts`** - Main agent orchestrator and test runner
- **`tools.ts`** - Git operations and file change detection
- **`commitMessage.ts`** - AI-powered commit message generation
- **`writeMarkdown.ts`** - Markdown file writing utilities
- **`prompts.ts`** - AI system prompts and instructions
- **`config.ts`** - Configuration settings

### AI Tools

The agent uses a modular tool architecture:

```typescript
{
  getFileChangesInDirectoryTool,    // Analyze git diffs
  generateCommitMessageTool,        // Generate commit messages  
  writeMarkdownTool                 // Save reviews to markdown
}
```

## 📊 Example Output

### Generated Commit Message
```
feat: add AI-powered commit message generation and markdown review tools
```

### Code Review Report (`review.md`)
```markdown
# Code Review Report
Generated on: 2025-09-15T10:30:00.000Z

## Summary
Enhanced the code review agent with commit message generation...

## Files Changed
- `commitMessage.ts` - New AI tool for commit message generation
- `writeMarkdown.ts` - Markdown file writing capabilities

## Code Quality Analysis
✅ **Good Practices:**
- Proper TypeScript typing with Zod schemas
- Error handling with fallback mechanisms
...
```

## 🛠️ Configuration

Customize the agent behavior in `config.ts`:

```typescript
export const CONFIG = {
  model: "gemini-2.5-flash",
  maxSteps: 10,
  excludeFiles: ["dist", "bun.lock", "node_modules"],
  defaultReviewFile: "review.md"
};
```

## 🔧 Advanced Usage

### Using Individual Tools

```typescript
// Get file changes
const changes = await getFileChangesInDirectoryTool.execute({
  rootDir: "/path/to/repo"
});

// Generate commit message
const commitMessage = await generateCommitMessageTool.execute({
  diffs: changes
});

// Save review to markdown
await writeMarkdownTool.execute({
  content: reviewContent,
  filePath: "custom-review.md"
});
```

### Custom Agent Prompts

```typescript
await codeReviewAgent(
  "Analyze changes focusing on security vulnerabilities and performance optimizations"
);
```

## 🧪 Testing

The project includes integrated testing functionality:

```bash
# Run the test function that demonstrates:
# 1. Git change detection
# 2. Commit message generation  
# 3. Code review creation
bun run index.ts
```

## 📋 Requirements

- **Bun** v1.2.22 or later
- **Git** repository with changes to analyze
- **Google AI API** access for Gemini model

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the agent to generate a review
5. Submit a pull request

## 📄 License

This project was created using `bun init` in bun v1.2.22. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
