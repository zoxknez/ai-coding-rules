# 🔴 Security

> Security guides for AI-assisted development.

## Files

| File | Purpose |
|------|---------|
| [PROMPT_INJECTION_DEFENSE.md](PROMPT_INJECTION_DEFENSE.md) | Defend against adversarial AI inputs |
| [AGENT_VULNERABILITIES.md](AGENT_VULNERABILITIES.md) | Language-specific vulnerability patterns |
| [CLOUD_IAC_SECURITY.md](CLOUD_IAC_SECURITY.md) | Terraform, Docker, Kubernetes security |

## Quick Reference

### Prompt Injection Defense
- Threat model and attack surface
- Direct and indirect injection prevention
- Tool call safety (allowlist, validation, human-in-the-loop)
- Output safety and monitoring

### Agent Vulnerabilities
- Language-specific security patterns
- Common AI-introduced vulnerability types

### Cloud & IaC
- Infrastructure as Code security
- Container and orchestration hardening

## Related
- [operations/SECURITY_PRIVACY_BASELINE.md](../operations/SECURITY_PRIVACY_BASELINE.md) — Non-negotiable security rules
- [operations/security_privacy.md](../operations/security_privacy.md) — Security guardrails
- [core/STRICT_MODE.md](../core/STRICT_MODE.md) — Non-bypassable rules
