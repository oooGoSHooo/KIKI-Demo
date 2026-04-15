---
name: asset-discovery
description: "Use when: a user or agent needs to find static assets (images, audio, JSON) in the public directory and map them to code."
---

# Asset Discovery Skill

This skill helps you find and correctly reference assets within the [public/](public/) directory.

## 📂 Asset Map Overview

### 📖 E-books ([public/ebooks/](public/ebooks/))
- **Structure**: Each subfolder (e.g., `U6-L1-D1`) contains sequential `.jpg` pages and `.MP3` audio files.
- **Convention**: `00.jpg`, `01.jpg`, `02.MP3`.

### 🧪 Test Modules ([public/test/](public/test/))
- **M1**: Listening exercises (Images and `.wav` audio).
- **M3/wordcard**: Vocabulary assets.
- **M3/VB-1-...**: Specific image sets for vocabulary building.

### 🃏 Learning Cards ([public/cards/](public/cards/))
- Pairs of `.png` (image) and `.wav` (pronunciation) for vocabulary words.

### 🎨 Icons ([public/icons/](public/icons/))
- Used for system UI, subscriptions, and menu items. Referenced as `'/icons/1.png'`.

## 🛠️ Usage Workflow

1.  **Search**: If you need a specific sound or image, search within `public/` using `run_in_terminal` with `ls` or `find`.
2.  **Verify**: Always check the file extension (some are `.mp3` case-sensitive, others are `.MP3` or `.wav`).
3.  **Reference**:
    - Always use absolute paths starting with `/` (e.g., `'/ebooks/U6-L1-D1/01.jpg'`).
    - Do NOT use `../public/...` in React components.

## ⚠️ Anti-Patterns
- Adding assets without updating any existing hardcoded mapping constants (like `EBOOK_PAGES` in `EbookReader.tsx`).
- Assuming filenames are lowercase (found `.MP3` and `.wav` in same directory).
