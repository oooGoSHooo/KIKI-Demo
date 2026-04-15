---
name: workspace-instructions
description: Global instructions for the KIKI-Demo Slim project.
---

# KIKI-Demo Slim Workspace Instructions

Welcome to the **KIKI-Demo Slim** project, a Vite + React + TypeScript educational application for English learning.

## 🚀 Quick Start
- **Install**: `npm install`
- **Dev**: `npm run dev` (Port 3000)
- **Build**: `npm run build`
- **Lint**: `npm run lint`

## 🏗️ Architecture & Component Boundaries
- **App Entry**: [src/App.tsx](src/App.tsx) - Manages global state, module switching, and navigation.
- **Learning Modules**: Located in [src/components/](src/components/).
  - `EbookReader`: Interactive book using `react-pageflip`.
  - `EnglishProficiencyTest`: Self-contained questionnaire and scoring system.
  - `ReadAloud` & `ExerciseModule`: Task-specific learning components.
- **Communication**: Modules communicate via callbacks (`onFinish`, `onBack`) from `App.tsx`.

## 🎨 Design & Styling
- **Source of Truth**: The `design.pen` file (use Pencil MCP tools to view/edit).
- **Styling**: Tailwind CSS v4. Configured in [src/index.css](src/index.css).
- **Fonts**: Primary font is "Fredoka".
- **Animations**: Framer Motion (`motion/react`) for all UI transitions.

## 📂 Asset Management
- **Static Assets**: All images, audio, and JSON data are in the `public/` directory.
- **Mapping**: assets are often hardcoded as absolute strings (e.g., `'/icons/1.png'`).
- **E-books**: [public/ebooks/](public/ebooks/) contains page-by-page assets.

## ⚠️ Important Conventions & Pitfalls
- **API Keys**: Requires `GEMINI_API_KEY` in `.env.local` for speech/AI features.
- **Orientation**: Some modules (like Proficiency Test) attempt to lock orientation to landscape.
- **Z-Index**: Be careful with stacking order when multiple `AnimatePresence` or full-screen modules are active.
- **Paths**: When adding or renaming assets in `/public`, ensure all references in `src/` are updated.

## 🛠️ Tooling
- Use **Pencil MCP** for design system tasks.
- Use **Terminal** for running build/dev commands.
- Use **Grep Search** or **Semantic Search** to find asset references before renaming.
