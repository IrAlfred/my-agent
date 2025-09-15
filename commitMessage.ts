import { tool } from "ai";
import { z } from "zod";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

const commitMessageInput = z.object({
  diffs: z.array(z.object({
    file: z.string(),
    diff: z.string(),
  })).describe("Array of file diffs to summarize for commit message")
});

type CommitMessageInput = z.infer<typeof commitMessageInput>;

function summarizeDiffsForCommit(diffs: CommitMessageInput["diffs"]): string {
  // Simple heuristic fallback: list changed files and a generic message
  if (!diffs.length) return "chore: no changes detected";
  const files = diffs.map(d => d.file).join(", ");
  return `chore: update ${files}`;
}

async function generateCommitMessage({ diffs }: CommitMessageInput) {
  if (!diffs.length) return "chore: no changes detected";
  
  try {
    // Use AI to generate a smart commit message
    const diffSummary = diffs.map(d => `File: ${d.file}\n${d.diff}`).join("\n\n");
    
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
    return summarizeDiffsForCommit(diffs);
  }
}

export const generateCommitMessageTool = tool({
  description: "Generates a commit message from code diffs",
  inputSchema: commitMessageInput,
  execute: generateCommitMessage,
});
