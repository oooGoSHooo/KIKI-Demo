---
name: design-system-sync
description: Sync changes between design.pen and the React codebase. Use when modifying UI components, layouts, or styles.
applyTo: "src/components/**, src/App.tsx, src/index.css"
---

# Design System Sync Strategy

When updating the UI for the KIKI-Demo Slim project:

1. **Pencil First**: Always start by checking or updating the `design.pen` file using Pencil MCP tools.
2. **Retrieve Information**: Use `pencil_get_editor_state` and `pencil_batch_get` to get the latest coordinate, layout, and styling information from the design system.
3. **Map to Code**:
   - **Colors/Spacing**: Map design tokens to Tailwind CSS classes in the React components.
   - **Components**: Ensure React component structure matches the logical hierarchy in `design.pen`.
   - **Assets**: If new assets are added to the design, ensure they are placed in [public/icons/](public/icons/) or the appropriate [public/](public/) subdirectory and referenced correctly.
4. **Validation**: Use `pencil_get_screenshot` to compare the coded component with the design artifact periodically.

## Asset Verification
Before renaming or moving key assets:
- Search for absolute path references like `'/icons/...'` or `'/ebooks/...'` using `grep_search`.
- Update all occurrences in React files BEFORE deleting old assets.
