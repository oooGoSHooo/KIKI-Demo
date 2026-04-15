---
name: lint-fix
description: "Workflow hook: Automatically runs Prettier and 'npm run lint' to ensure code quality after edits."
applyTo: "**/*.{ts,tsx,css,json}"
---

# Linting and Formatting Hook

This hook ensures every change follows the project's formatting and typing standards.

## Execution Order
1. **Format**: `npx prettier --write {{RELATIVE_FILE_PATH}}`
2. **Type Check**: `npm run lint` (which runs `tsc --noEmit`)

## Principles
- **No Manual Fixes**: The agent should let Prettier handle spacing, quotes, and Tailwind class ordering.
- **Fail Early**: If `npm run lint` fails, the agent must address the TypeScript errors before concluding the task.
