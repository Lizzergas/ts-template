# TypeScript OpenAI Template

OpenAI API client for learning JavaScript and TypeScript.

## Setup

```bash
npm install
cp .env.example .env  # Configure environment variables
npm run dev
```

## Environment Variables

```bash
OPENAI_API_KEY=sk-...                    # Required
NODE_ENV=development                     # development|production
```

## Scripts

- `dev` - Watch mode with tsx
- `build` - TypeScript compilation
- `start` - Production run
- `check` - Type check + lint
- `fix` - Auto-fix linting issues 