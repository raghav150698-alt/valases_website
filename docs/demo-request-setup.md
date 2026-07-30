# Demo request setup

The public form posts to the server-side Vercel function at
`/api/demo-request`. The function validates the request and inserts it into a
private Supabase table. Supabase secrets are never sent to the browser.

## Supabase

1. Open the production Supabase SQL Editor.
2. Run `docs/sql/website_demo_requests.sql`.
3. Confirm that `anon` and `authenticated` cannot select or insert rows.

## Vercel variables

Set these on the website project:

```text
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SECRET_KEY=<server-only secret key>
```

Optional email notification:

```text
RESEND_API_KEY=<server-only Resend key>
DEMO_RECIPIENT_EMAIL=hello@valases.com
DEMO_FROM_EMAIL=Valases Website <website@valases.com>
```

Redeploy after changing environment variables. Submit one test request and
confirm that it appears in `website_demo_requests`.
