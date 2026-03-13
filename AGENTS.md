# AGENTS.md

## Project overview
This repository powers https://www.onemillionqubits.com/.

It is a TypeScript project with a split architecture:
- `client/` = public website and frontend tools
- `server/` = backend / server entrypoints
- `shared/` = code shared across frontend and backend
- `script/` = build-related scripts

Assume this is a production website, not a sandbox.

## Main working rule
Prefer the smallest correct change.

Do not explore the whole repository unless the task truly requires it.
For small UI or copy edits, start in `client/` only.
Only inspect `server/` or `shared/` if the relevant value is clearly imported from there.

## Task scoping rules
Before editing:
1. Identify the exact owning file(s).
2. Identify the minimum validation needed.
3. Avoid unrelated exploration.

For small tasks:
- do not refactor
- do not rename files
- do not move code
- do not touch styling unless the task requires it
- do not “clean up” unrelated code

If the user asks for a tiny change, do only that tiny change.

## Ask mode behavior
For vague or underspecified tasks, use Ask mode first.

Ask mode should return:
1. exact file path(s)
2. relevant dependency/import chain only if needed
3. the smallest implementation plan
4. the minimum validation command

Do not jump into broad implementation when the task can be scoped first.

## Frontend-first rule
For website text, layout, footer, header, page content, routing, and tool UI:
- start in `client/`
- inspect `client/src/` before searching elsewhere
- check `client/public/` only for static assets
- only inspect `shared/` if text, schema, or constants are imported from there

## Backend rule
Do not inspect or change `server/` unless:
- the task explicitly involves APIs, server rendering, auth, persistence, or backend behavior
- or frontend code clearly depends on a backend response that must change

## Validation policy
Use the cheapest validation that gives confidence.

Preferred order:
1. targeted file inspection
2. `npm run check` for TypeScript confidence
3. `npm run build` for production confidence

Do not run broad or repeated validations unless necessary.
Do not run exploratory commands that do not help solve the task.

## Commands
Common commands:
- install dependencies: `npm install`
- dev server: `npm run dev`
- type check: `npm run check`
- production build: `npm run build`
- production start: `npm run start`

## Deployment awareness
This repo is deployed as a website.
Treat changes to routing, build output, and public assets carefully.

Do not change deployment-related files unless the task explicitly requires it.

## UX and content protection
This is an educational project and brand asset.

Do not:
- rewrite educational content beyond the requested scope
- replace the tone or branding casually
- change legal/footer/copyright/licensing text unless explicitly asked
- introduce placeholder text
- simplify content in ways that reduce teaching value

## Code style
- keep TypeScript code straightforward and readable
- prefer localized edits over architectural rewrites
- preserve existing patterns unless there is a clear reason not to
- avoid adding dependencies unless explicitly justified
- avoid speculative abstractions

## Analytics and production safety
If touching analytics, routing, or public-site behavior:
- keep the existing behavior intact unless explicitly changing it
- avoid silent breaking changes
- mention any manual verification the owner should do in production

## Output format for implementation tasks
At the end, report:
1. files changed
2. exact behavior changed
3. validation run
4. any manual follow-up or risk

## Output format for Ask mode
At the end, report:
1. exact file(s) to edit
2. why those files
3. minimal implementation plan
4. minimal validation plan

## Hard stop conditions
Stop and ask for direction instead of guessing if:
- the task requires secrets, credentials, or external account access
- the task would change legal/licensing/trademark wording without explicit instruction
- the task would require broad refactoring to complete cleanly
- the exact owning file cannot be identified with reasonable confidence
