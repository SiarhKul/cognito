# Cognito frontend

React/Vite SPA with Amazon Cognito Managed Login. It uses OAuth 2.0 Authorization Code Flow with PKCE: the application never receives a password or client secret.

The app also provides a custom registration and email-confirmation flow. It stores `given_name`, `family_name`, and `custom:company` through Cognito's public SignUp API. The User Pool and app client must permit read/write access to these attributes.

## Local start

1. Copy `.env.example` to `.env.local` and fill values.
2. In the Cognito app client, configure **Allowed callback URL** and **Allowed sign-out URL** as the exact `http://localhost:5173` (or the configured URL).
3. Enable **Authorization code grant** and `openid`, `email`, `profile` scopes.
4. Use a public app client — **do not generate a client secret**.
5. Run `npm run dev`.

For the API test button, API Gateway CORS must allow `http://localhost:5173` and the `Authorization` header.

## Variables

| Variable | Purpose |
| --- | --- |
| `VITE_COGNITO_ISSUER` | `https://cognito-idp.<region>.amazonaws.com/<userPoolId>` |
| `VITE_COGNITO_CLIENT_ID` | Public app client ID |
| `VITE_COGNITO_DOMAIN` | Managed Login domain used for global sign-out |
| `VITE_REDIRECT_URI` / `VITE_LOGOUT_URI` | OAuth return URLs |
| `VITE_API_URL` | Optional JWT-protected API Gateway route |

`VITE_*` values are sent to the browser. Do not put secrets, passwords, private keys, or AWS credentials in them.

## Checks

```bash
npm run build
npm run lint
```
