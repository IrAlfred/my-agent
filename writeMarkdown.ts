import { tool } from "ai";
import { z } from "zod";
import { writeFile } from "fs/promises";

const writeMarkdownInput = z.object({
  content: z.string().describe("Markdown content to write"),
  filePath: z.string().default("review.md").describe("Path to the markdown file to write to, default is review.md")
});

type WriteMarkdownInput = z.infer<typeof writeMarkdownInput>;

async function writeMarkdownFile({ content, filePath }: WriteMarkdownInput) {
  await writeFile(filePath, content, "utf-8");
  return { success: true, filePath };
}

export const writeMarkdownTool = tool({
  description: "Writes markdown content to a file (default: review.md)",
  inputSchema: writeMarkdownInput,
  execute: writeMarkdownFile,
});
