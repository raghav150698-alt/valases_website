# Valases website

Public product website for the Valases enterprise hiring platform.

## Local preview

Serve the repository root with any static HTTP server and open `index.html`.
The demo request API is a Vercel serverless function and requires the
production environment variables documented in `docs/demo-request-setup.md`.

## Deployment

The project deploys to Vercel with the `Other` framework preset. The checked-in
`vercel.json` serves the repository root, enables clean URLs, and applies basic
security headers.
