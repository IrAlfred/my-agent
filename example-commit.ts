#!/usr/bin/env bun

// Direct function implementations for the example
async function getFileChangesInDirectory({ rootDir }: { rootDir: string }) {
  const { simpleGit } = await import("simple-git");
  const excludeFiles = ["dist", "bun.lock"];
  
  const git = simpleGit(rootDir);
  const summary = await git.diffSummary();
  const diffs: { file: string; diff: string }[] = [];

  for (const file of summary.files) {
    if (excludeFiles.includes(file.file)) continue;
    const diff = await git.diff(["--", file.file]);
    diffs.push({ file: file.file, diff });
  }

  return diffs;
}

async function generateCommitMessage({ diffs }: { diffs: { file: string; diff: string }[] }) {
  if (!diffs.length) return "chore: no changes detected";
  
  try {
    // Use AI to generate a smart commit message
    const diffSummary = diffs.map(d => `File: ${d.file}\n${d.diff}`).join("\n\n");
    
    const { generateText } = await import("ai");
    const { google } = await import("@ai-sdk/google");
    
    const { text } = await generateText({
      model: google("models/gemini-2.5-flash"),
      prompt: `Based on the following git diffs, generate a concise and descriptive commit message following conventional commit format (type: description). Focus on the main purpose and impact of the changes.

Diffs:
${diffSummary}

Generate only the commit message, nothing else.`,
    });
    
    return text.trim();
  } catch (error) {
    // Fallback to simple heuristic if AI fails
    console.warn("AI commit message generation failed, using fallback:", error);
    const files = diffs.map(d => d.file).join(", ");
    return `chore: update ${files}`;
  }
}

// Example of how to use the commit message generation
async function generateCommitExample() {
  try {
    // First, get the file changes from the current directory
    console.log("Getting file changes...");
    const changes = await getFileChangesInDirectory({
      rootDir: "/home/alfred/alx/my-agent"
    });

    console.log(`Found ${changes.length} changed files`);
    
    if (changes.length > 0) {
      // Generate commit message from the changes
      console.log("Generating commit message...");
      const commitMessage = await generateCommitMessage({
        diffs: changes
      });

      console.log("\n=== Generated Commit Message ===");
      console.log(commitMessage);
      console.log("=================================\n");
    } else {
      console.log("No changes detected in the repository.");
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the example
generateCommitExample();
