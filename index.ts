//console.log("Hello via Bun!");
//import { generateText } from "ai";

//import { google } from "@ai-sdk/google";

//const { text } = await generateText({
//   model: google("models/gemini-2.5-flash"),
 //   prompt: "What is an AI agent?",
//});

//console.log(text);

//this is added for testing purposes

import { stepCountIs, streamText, generateText } from "ai";
import { google } from "@ai-sdk/google";
import { SYSTEM_PROMPT } from "./prompts";
import { getFileChangesInDirectoryTool } from "./tools";
import { generateCommitMessageTool } from "./commitMessage";
import { writeMarkdownTool } from "./writeMarkdown";
import { simpleGit } from "simple-git";

const codeReviewAgent = async (prompt: string) => {
  const result = streamText({
    model: google("models/gemini-2.5-flash"),
    prompt,
    system: SYSTEM_PROMPT,
    tools: {
      getFileChangesInDirectoryTool: getFileChangesInDirectoryTool,
      generateCommitMessageTool: generateCommitMessageTool,
      writeMarkdownTool: writeMarkdownTool,
    },
    stopWhen: stepCountIs(10),
  });

  for await (const chunk of result.textStream) {
    process.stdout.write(chunk);
  }
};

// Test function to demonstrate commit message generation and code review saving
async function testCommitAndReview() {
  try {
    // Get file changes from the current directory
    console.log("🔍 Checking for git changes...");
    const git = simpleGit("/home/alfred/alx/my-agent");
    const summary = await git.diffSummary();
    
    if (summary.files.length === 0) {
      console.log("❌ No changes detected. Make some changes first!");
      return;
    }
    
    console.log(`✅ Found ${summary.files.length} changed files:`);
    summary.files.forEach(file => {
      console.log(`  - ${file.file}`);
    });
    
    // Get diffs for commit message generation
    const diffs: { file: string; diff: string }[] = [];
    const excludeFiles = ["dist", "bun.lock"];
    
    for (const file of summary.files) {
      if (excludeFiles.includes(file.file)) continue;
      const diff = await git.diff(["--", file.file]);
      diffs.push({ file: file.file, diff });
    }
    
    if (diffs.length === 0) {
      console.log("❌ No valid diffs found for analysis");
      return;
    }
    
    console.log("\n🤖 Generating commit message...");
    
    // Generate AI-powered commit message (display only, don't save)
    const diffSummary = diffs.map(d => `File: ${d.file}\n${d.diff}`).join("\n\n");
    
    const { text: commitMessage } = await generateText({
      model: google("models/gemini-2.5-flash"),
      prompt: `Based on the following git diffs, generate a concise and descriptive commit message following conventional commit format (type: description). Focus on the main purpose and impact of the changes.

Diffs:
${diffSummary}

Generate only the commit message, nothing else.`,
    });
    
    console.log("\n📝 Generated Commit Message:");
    console.log("=".repeat(50));
    console.log(commitMessage.trim());
    console.log("=".repeat(50));
    
    console.log("\n📋 Generating detailed code review...");
    
    // Generate comprehensive code review
    const { text: codeReview } = await generateText({
      model: google("models/gemini-2.5-flash"),
      prompt: `As an expert code reviewer, analyze the following code changes and provide a comprehensive review in markdown format. Include:

1. **Summary** - Brief overview of changes
2. **Files Changed** - List of modified files with descriptions
3. **Code Quality Analysis** - Assessment of code quality, patterns, and best practices
4. **Suggestions** - Specific improvements and recommendations
5. **Security Considerations** - Any security implications
6. **Performance Impact** - Performance considerations if applicable

Format the response as proper markdown with headers, bullet points, and code blocks where appropriate.

Git Diffs:
${diffSummary}`,
    });
    
    // Save the code review to markdown file
    const reviewContent = `# Code Review Report
Generated on: ${new Date().toISOString()}
Commit Message: ${commitMessage.trim()}

---

${codeReview}`;
    
    await Bun.write("/home/alfred/alx/my-agent/review.md", reviewContent);
    console.log("\n💾 Code review saved to: review.md");
    console.log("📖 You can now open review.md to see the detailed analysis!");
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Specify which directory the code review agent should review changes in your prompt
//await codeReviewAgent(
//  "Review the code changes in '../my-agent' directory, make your reviews and suggestions file by file",
//);

// Example: Generate commit message and write review to markdown
//await codeReviewAgent(
//  "Please analyze the code changes in '/home/alfred/alx/my-agent' directory, generate a commit message for these changes, and write a comprehensive code review to a markdown file called 'review.md'. Focus on code quality, security, performance, and provide specific suggestions for improvement."
//);

// Run the test function to demonstrate functionality
await testCommitAndReview();
