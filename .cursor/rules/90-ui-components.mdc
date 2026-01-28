---
description: Rules for UI component development (React, Vue, Svelte)
globs: ["**/components/**/*.{tsx,jsx,vue,svelte}", "**/*.component.{tsx,jsx}"]
alwaysApply: false
---

# 🎨 UI Components Rules

> Auto-activated for component files in `/components/` directories.

## Component Structure

```
ComponentName/
├── ComponentName.tsx       # Main component
├── ComponentName.test.tsx  # Tests (required)
├── ComponentName.stories.tsx # Storybook (optional)
└── index.ts               # Re-export
```

## Rules

### 1. Single Responsibility
- One component = one purpose
- Max 200 lines per component file
- Extract hooks to separate files when >50 lines

### 2. Props Pattern
```typescript
// ✅ GOOD: Typed, documented, with defaults
interface ButtonProps {
  /** Button label */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Visual variant */
  variant?: 'primary' | 'secondary';
  /** Disabled state */
  disabled?: boolean;
}

export const Button = ({ 
  label, 
  onClick, 
  variant = 'primary',
  disabled = false 
}: ButtonProps) => { ... }
```

### 3. Accessibility (STRICT)
- All interactive elements must have `aria-label` or visible text
- Form inputs must have associated `<label>` elements
- Color contrast must meet WCAG 2.1 AA
- Keyboard navigation must work

### 4. Performance
- Use `React.memo()` for expensive renders
- Avoid inline functions in JSX when used as deps
- Lazy load heavy components with `React.lazy()`

### 5. Styling
- Tailwind utility classes preferred
- No inline styles except dynamic values
- CSS-in-JS only when necessary

## Forbidden Patterns

```typescript
// ❌ NEVER: Untyped props
const Button = (props: any) => ...

// ❌ NEVER: Business logic in components
const Button = () => {
  const data = await fetch('/api/...')  // Move to hook
}

// ❌ NEVER: Direct DOM manipulation
document.getElementById('x').style.color = 'red'
```

## Testing Requirements

- Render test (component mounts without errors)
- Props test (variants behave correctly)
- Interaction test (click/hover handlers fire)
- Accessibility test (using @testing-library/jest-dom)
