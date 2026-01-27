# Incident Response for AI-Introduced Bugs (v2)

## When a regression is detected
1) Identify offending commit/PR
2) Rollback or hotfix with minimal diff
3) Add a regression test that would have caught it
4) Add a rule to project profile/prompt cookbook to prevent repeat

## Postmortem questions
- Was the requirement ambiguous?
- Did we skip verification steps?
- Did AI introduce side effects outside scope?
- Was code review rubric applied?

## Prevent recurrence
- Add tests
- Tighten task templates
- Add lint rules
