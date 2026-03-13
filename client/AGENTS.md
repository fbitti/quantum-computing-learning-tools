# AGENTS.md

## Scope
This file applies to work inside `client/`.

This area contains the public website, SPA behavior, and frontend quantum learning tools.

## Default behavior
For any task inside `client/`:
- stay inside `client/` unless an import clearly points to `shared/`
- do not inspect `server/` unless the task explicitly requires backend work
- prefer the smallest possible edit

## Small-change rule
For copy, footer, header, CTA, layout, and styling edits:
- identify the exact owning component first
- change only the necessary lines
- do not refactor nearby components
- do not restyle unrelated sections
- do not touch analytics or routing unless asked

## Validation
For frontend-only changes, prefer:
1. local file-level reasoning
2. `npm run check`
3. `npm run build`

Do not run wider validation unless needed.

## Content and branding
Do not alter:
- project name
- branding
- legal/footer text
- educational explanations
unless the task explicitly asks for it.

## Final report
Return:
1. file(s) changed
2. what changed visually or behaviorally
3. validation run
4. any manual browser check recommended
