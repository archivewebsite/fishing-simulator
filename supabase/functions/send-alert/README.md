# send-alert Edge Function

Sends cheat/error alert emails through Resend.

## Required Supabase secrets

```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key
```

## Optional Supabase secrets

```bash
supabase secrets set ALERT_TO_EMAIL=unvermicular@gmail.com
supabase secrets set ALERT_FROM_EMAIL="FishingGame Alert <onboarding@resend.dev>"
```

## Deploy

```bash
supabase functions deploy send-alert --no-verify-jwt
```

`--no-verify-jwt` is required when this alert endpoint is called by players who are not logged in.
