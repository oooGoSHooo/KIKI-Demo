---
name: add-module
description: "Prompt template: Scaffold a new interactive learning module based on the EnglishProficiencyTest pattern."
---

# Create New Learning Module

To create a new interactive module, follow the patterns in `src/components/EnglishProficiencyTest/EnglishProficiencyTest.tsx`.

## Core Requirements
1.  **Strict Typing**: Define a `Props` type with at least `onComplete` and `onBack`.
2.  **State Machine**: Use a `step` state (e.g., `'intro' | 'active' | 'result'`) to manage the user flow.
3.  **Animations**: Wrap transitions in `<AnimatePresence mode="wait">` and use `<motion.div>`.
4.  **Landscape Lock**: Include the `useEffect` landscape orientation guard found in the reference.
5.  **Sound Effects**: Use `playClickSound`, `playSuccessSound`, and `playWarningSound` for user feedback.

## Boilerplate Structure

```tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { playClickSound } from './Button'; // Or equivalent

export type ModuleProps = {
  onComplete: (data: any) => void;
  onBack?: () => void;
};

type Step = 'intro' | 'task' | 'summary';

export function NewModule({ onComplete, onBack }: ModuleProps) {
  const [step, setStep] = useState<Step>('intro');

  // Add Orientation Guard here...
  
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#F7FFF7]">
      {/* Header with onBack */}
      {/* Step Router with AnimatePresence */}
    </div>
  );
}
```

## Styling Notes
- Use **Tailwind CSS v4**.
- Font should default to `Fredoka` as configured in `src/index.css`.
- Prefer soft, rounded corners (`rounded-2xl` or `rounded-3xl`) for the "kid-friendly" aesthetic.
