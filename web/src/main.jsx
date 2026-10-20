import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";
import App from "./App";

const requiredSettings = [
  "VITE_COGNITO_ISSUER",
  "VITE_COGNITO_CLIENT_ID",
  "VITE_COGNITO_DOMAIN",
];
const missingSettings = requiredSettings.filter(
  (name) => !import.meta.env[name],
);

const cognitoAuthConfig = {
  authority: import.meta.env.VITE_COGNITO_ISSUER,
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_REDIRECT_URI || window.location.origin,
  post_logout_redirect_uri:
    import.meta.env.VITE_LOGOUT_URI || window.location.origin,
  response_type: "code",
  scope: "openid email profile",
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
  onSigninCallback: () =>
    window.history.replaceState({}, document.title, window.location.pathname),
};

const configurationError = (
  <main style={{ fontFamily: "system-ui", margin: "3rem", maxWidth: "45rem" }}>
    <h1>Cognito configuration required</h1>
    <p>
      Create <code>.env.local</code> from the <code>.env.example</code>{" "}
      template.
    </p>
    <p>Missing values: {missingSettings.join(", ")}.</p>
  </main>
);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {missingSettings.length ? (
      configurationError
    ) : (
      <AuthProvider {...cognitoAuthConfig}>
        <App />
      </AuthProvider>
    )}
  </React.StrictMode>,
);
