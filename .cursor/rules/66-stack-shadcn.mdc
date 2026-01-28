---
description: "USE WHEN: working with Shadcn UI, Tailwind CSS, Lucide icons, or Sonner toasts."
globs: ["**/components/ui/**","**/components/**/*.tsx","**/*.tsx"]
alwaysApply: false
priority: 45
---

# Shadcn UI Stack Rules

## Installation

### Adding Components
```bash
# ✅ Use the CLI — never copy manually
npx shadcn@latest add button
npx shadcn@latest add card dialog

# Add multiple at once
npx shadcn@latest add button card input label
```

### Configuration
Ensure `components.json` exists with proper settings:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

---

## Class Name Management

### The cn() Helper (MANDATORY)
```typescript
// ✅ Always use cn() for conditional classes
import { cn } from "@/lib/utils";

<div className={cn(
  "base-class",
  condition && "conditional-class",
  variant === "primary" && "bg-primary text-primary-foreground"
)} />
```

### Implementation
```typescript
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Why cn()?
- Resolves Tailwind class conflicts (e.g., `p-2` vs `p-4`)
- Handles conditional classes cleanly
- Supports arrays and objects

---

## Theming

### CSS Variables
Define in `globals.css`:
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    /* ... other variables */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    /* ... other variables */
  }
}
```

### Theme Switching
```typescript
// Use next-themes or similar
import { ThemeProvider } from "next-themes";

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

### Toggle Dark Mode
Toggle `.dark` class on `<html>` element — CSS variables handle the rest.

---

## Icons (Lucide)

### Specifications
- Default size: **24×24 px**
- Stroke width: **2px**
- Style: Rounded line icons

### Usage
```typescript
import { ArrowRight, Check, X } from "lucide-react";

// ✅ Consistent sizing
<ArrowRight className="h-6 w-6" />

// ✅ With button
<Button>
  Next <ArrowRight className="ml-2 h-4 w-4" />
</Button>

// ✅ Icon-only button (requires aria-label)
<Button variant="ghost" size="icon" aria-label="Close">
  <X className="h-4 w-4" />
</Button>
```

### Naming Convention
- Use **kebab-case** in imports when possible
- Match Lucide naming: `arrow-right` → `ArrowRight`

---

## Toasts (Sonner)

### Setup
```typescript
// In layout or root
import { Toaster } from "sonner";

<Toaster position="bottom-right" richColors />
```

### Usage Patterns

#### Basic Toast
```typescript
import { toast } from "sonner";

// Types
toast.success("Operation completed");
toast.error("Something went wrong");
toast.info("FYI...");
toast.warning("Be careful");
```

#### Async Operations (RECOMMENDED)
```typescript
// ✅ Best practice for async actions
toast.promise(asyncOperation(), {
  loading: "Saving...",
  success: "Saved successfully!",
  error: "Failed to save"
});

// ✅ With data transformation
toast.promise(fetchUser(id), {
  loading: "Loading user...",
  success: (data) => `Welcome, ${data.name}!`,
  error: (err) => `Error: ${err.message}`
});
```

### Rules
- **Maximum 3 concurrent toasts** — avoid clutter
- Use `toast.promise` for all async operations
- Use appropriate toast types (success/error/info/warning)
- Keep messages short and actionable

---

## Component Patterns

### Forms
```typescript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<form onSubmit={handleSubmit}>
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
    <Button type="submit">Submit</Button>
  </div>
</form>
```

### Dialogs
```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description here.</DialogDescription>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

### Loading States
```typescript
import { Skeleton } from "@/components/ui/skeleton";

// Always show skeleton before data loads
{isLoading ? (
  <div className="space-y-2">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </div>
) : (
  <ActualContent data={data} />
)}
```
