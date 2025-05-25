# TypeScript OpenAI Template

OpenAI API client with secure proxy support for development environments.

## Setup

```bash
npm install
cp .env.example .env  # Configure environment variables
npm run dev
```

## Environment Variables

```bash
OPENAI_API_KEY=sk-...                    # Required
HTTPS_PROXY=http://localhost:9090        # Optional - proxy URL
NODE_ENV=development                     # development|production
PROXY_CERT_PATH=./ca.pem                # Proxy certificate path
UNSAFE_PROXY=false                      # Disable cert validation (dev only)
```

## Proxy Configuration

**Secure Mode (Recommended):**
1. Export Proxyman root certificate as PEM
2. Save to `PROXY_CERT_PATH` location
3. Run with `npm run start`

**Unsafe Mode (Development Only):**
```bash
UNSAFE_PROXY=true npm run dev
# or
npm run start:unsafe
```

## Scripts

- `dev` - Watch mode with tsx
- `build` - TypeScript compilation
- `start` - Production run with cert validation
- `start:unsafe` - Development run without cert validation
- `check` - Type check + lint
- `fix` - Auto-fix linting issues 