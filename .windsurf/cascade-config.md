# Windsurf Cascade Configuration

> Customization tips for Windsurf's Cascade AI assistant.

## Recommended Settings

### Tool Calling
- Enable Auto-Continue for long trajectories
- Use checkpoints before major changes
- Leverage real-time awareness feature

### Context Management
- Use @-mentions for specific files/functions
- Reference previous conversations when relevant
- Keep prompts focused and specific

## Ignore Files

Create `.codeiumignore` at repo root to exclude files from Cascade:

```
# Sensitive files
.env
.env.*
secrets/
*.pem
*.key

# Build outputs
node_modules/
dist/
build/
.next/

# Large files
*.log
*.lock
```

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Cascade | `Cmd/Ctrl + L` |
| Inline Command | `Cmd/Ctrl + I` |
| Accept Changes | `Cmd/Ctrl + Enter` |
| Revert Changes | Hover + Revert Arrow |

## Best Practices

1. **Use Code Mode** for file modifications
2. **Use Chat Mode** for questions/explanations
3. **Create checkpoints** before risky operations
4. **Revert** when changes go wrong
5. **Queue messages** while waiting for completion
