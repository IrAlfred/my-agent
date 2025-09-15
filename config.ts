// Configuration file for the code review agent
export const CONFIG = {
  // Model configuration
  model: "gemini-2.5-flash",
  maxSteps: 10,
  
  // File exclusions for git operations
  excludeFiles: ["dist", "bun.lock", "node_modules", ".git"],
  
  // Output settings
  defaultReviewFile: "review.md",
  defaultCommitFile: "generated-commit.txt",
  
  // AI prompt settings
  commitMessageMaxLength: 100,
  reviewMaxLength: 5000,
};
