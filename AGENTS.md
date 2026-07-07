## Code style guidelines

### Patterns

### General

- When ordering members of a module
  - put the exported functions/constans/types first and local ones last
  - if the function depends on another one in this module, put the latter after the former
    we read the higher level code first and then go down to the implementation details
  - try to keep related members close to each other.
- Try to keep files small (under 200–300 loc) and focused, splitting them in smaller logically cohesive modules if necessary
- Don't introduce a variable (const) if it is used only once, unless it is a very complex expression and it helps readability
- Don't create index modules with just re-exports, prefer direct imports of the actual file
- `as any` in TypeScript is your last resort, try to avoid it. If you have to use it, add a comment explaining why and what is the expected type.

## IMPORTANT General Guidelines

- When explaining things, be extremely concise. Sacrifice grammar for the sake of concision.
- When adding new npm deps, use exact version only, no ^ or ~.
- Follow the project's coding style and conventions
  - call `prettier --write` and then `eslint --fix` for each edited ts/tsx file
- Always call `npm run compile` to check build errors and fix them before finishing the work
- When a new source file is created, make `git add` for it explicitly; don't use `git add .` or `git add -A`
- Do not implement or improve any code not directly related to the task at hand
- Always respond in the language you were prompted unless asked otherwise
