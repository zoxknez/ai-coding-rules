# Accessibility (A11Y) Guide for AI-Generated Code (v1)

> If it's not accessible, it's not done. Accessibility is a correctness requirement, not a feature.

---

## WCAG 2.2 Compliance Target

| Level | Requirement | When |
|-------|-------------|------|
| **A** | Minimum — legal baseline | All projects |
| **AA** | Standard — industry expectation | All commercial projects |
| **AAA** | Enhanced — specialized needs | Government, healthcare, education |

**Default target: WCAG 2.2 Level AA**

## The Big Four (POUR)

| Principle | Meaning | AI Must Ensure |
|-----------|---------|----------------|
| **Perceivable** | Users can perceive content | Alt text, captions, contrast |
| **Operable** | Users can interact | Keyboard nav, focus management |
| **Understandable** | Users can comprehend | Clear labels, error messages |
| **Robust** | Works with assistive tech | Semantic HTML, ARIA |

## Semantic HTML Rules

### Always Use
```html
<!-- ✅ Semantic -->
<nav>...</nav>
<main>...</main>
<article>...</article>
<button onClick={handle}>Submit</button>
<a href="/about">About</a>

<!-- ❌ Non-semantic (AI generates this constantly) -->
<div class="nav">...</div>
<div class="main">...</div>
<div class="article">...</div>
<div onClick={handle}>Submit</div>  <!-- NOT a button -->
<span onClick={goTo}>About</span>   <!-- NOT a link -->
```

### Heading Hierarchy
```html
<!-- ✅ Correct hierarchy -->
<h1>Page Title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>

<!-- ❌ Skip levels (AI does this often) -->
<h1>Page Title</h1>
  <h4>Random heading</h4>  <!-- Skipped h2, h3 -->
```

## Keyboard Navigation

### Requirements
- Every interactive element must be reachable via `Tab`
- Action must be triggerable via `Enter` or `Space`
- Current focus must be visible (never `outline: none` without replacement)
- Focus order must match visual order
- Escape closes modals and dropdowns
- Arrow keys navigate within composite widgets (tabs, menus, grids)

### Focus Management
```tsx
// ✅ When opening a modal, move focus to it
function openModal() {
  setOpen(true);
  // After render, focus the first interactive element
  requestAnimationFrame(() => modalRef.current?.focus());
}

// ✅ When closing a modal, return focus to trigger
function closeModal() {
  setOpen(false);
  triggerRef.current?.focus();
}
```

### Focus Trap (Modals)
```
While a modal is open:
  Tab cycles through elements inside the modal only
  Cannot Tab to elements behind the modal
  Escape closes the modal
```

## Color and Contrast

### Minimum Contrast Ratios (WCAG AA)

| Element | Ratio | Tool |
|---------|-------|------|
| Normal text (< 18px) | 4.5:1 | WebAIM Contrast Checker |
| Large text (≥ 18px or 14px bold) | 3:1 | WebAIM Contrast Checker |
| UI components and graphics | 3:1 | Lighthouse |

### Rules
- ❌ Never use color alone to convey information
- ✅ Add icons, patterns, or text labels alongside color
- ✅ Test with color blindness simulators
- ✅ Support `prefers-color-scheme` and `prefers-contrast`

## Images and Media

### Images
```html
<!-- ✅ Informative image -->
<img src="chart.png" alt="Revenue increased 23% in Q4 2025" />

<!-- ✅ Decorative image -->
<img src="divider.png" alt="" role="presentation" />

<!-- ❌ Missing or useless alt (AI default) -->
<img src="chart.png" />
<img src="chart.png" alt="chart" />  <!-- Describes format, not content -->
```

### Video/Audio
- ✅ Captions for video (not auto-generated without review)
- ✅ Transcript for audio content
- ✅ Audio descriptions for meaningful visuals in video
- ✅ Pause/stop controls for auto-playing media

## Forms

### Labels
```html
<!-- ✅ Explicit label association -->
<label for="email">Email address</label>
<input id="email" type="email" required aria-describedby="email-hint" />
<span id="email-hint">We'll never share your email</span>

<!-- ❌ No label (AI generates this constantly) -->
<input type="email" placeholder="Email" />  <!-- Placeholder is NOT a label -->
```

### Error Messages
```html
<!-- ✅ Connected to input, descriptive -->
<input id="email" aria-invalid="true" aria-describedby="email-error" />
<span id="email-error" role="alert">Please enter a valid email address</span>

<!-- ❌ Generic, disconnected -->
<span class="error">Invalid input</span>  <!-- Which input? What's wrong? -->
```

### Form Requirements
- Every input has a visible `<label>`
- Required fields are indicated (not just with `*`)
- Error messages explain what's wrong AND how to fix it
- Errors are associated with their field via `aria-describedby`
- Form can be submitted via `Enter` key

## ARIA Usage

### First Rule of ARIA
```
Don't use ARIA if native HTML works.
<button> is better than <div role="button">
```

### Common ARIA Patterns

| Widget | Role | Required Properties |
|--------|------|-------------------|
| Modal | `role="dialog"` | `aria-modal="true"`, `aria-labelledby` |
| Tab panel | `role="tablist"`, `role="tab"`, `role="tabpanel"` | `aria-selected`, `aria-controls` |
| Alert | `role="alert"` | (Live region, auto-announced) |
| Navigation | `role="navigation"` or `<nav>` | `aria-label` if multiple navs |
| Loading | `aria-busy="true"` | On container being updated |
| Toggle | `aria-pressed="true/false"` | On button that toggles |

### Live Regions
```html
<!-- ✅ Announce dynamic content changes -->
<div aria-live="polite">
  <!-- Screen reader announces when content changes -->
  {statusMessage}
</div>

<!-- For urgent updates -->
<div aria-live="assertive" role="alert">
  {errorMessage}
</div>
```

## AI-Generated Code A11Y Checklist

### AI Fails at These (Always Check)

| Issue | AI Default | Correct |
|-------|-----------|---------|
| Clickable divs | `<div onClick>` | `<button>` |
| Missing alt text | `<img src="...">` | `<img alt="description">` |
| No labels | `<input placeholder="...">` | `<label> + <input>` |
| Color-only status | Red/green indicators | Color + icon + text |
| No focus management | Modal opens, focus stays behind | Focus moves to modal |
| No skip link | Must Tab through entire nav | "Skip to main content" link |
| Outline removed | `outline: none` | Custom visible focus indicator |
| Auto-play | Video plays on load | `<video>` without `autoplay` |

## Testing Tools

| Tool | Type | What It Catches |
|------|------|----------------|
| axe-core / @axe-core/react | Automated | ~40% of WCAG issues |
| Lighthouse | Automated | Basic a11y score + issues |
| NVDA / VoiceOver | Manual | Screen reader experience |
| Keyboard-only testing | Manual | Focus and navigation issues |
| Color contrast analyzer | Checker | Contrast ratio violations |

### Automated Testing Integration
```typescript
// ✅ Include a11y checks in test suite
import { axe, toHaveNoViolations } from 'jest-axe';

it('has no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Related Docs
- [stack_frontend](../stacks/stack_frontend.md) — frontend development rules
- [testing_strategy](../quality/testing_strategy.md) — include a11y in test suite
- [code_review_rubric](../quality/code_review_rubric.md) — a11y as review criterion
