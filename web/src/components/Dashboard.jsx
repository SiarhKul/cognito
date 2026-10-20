import { useState } from "react";
import { SecurityNote } from "./Shared";

const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

function readGroups(profile) {
  const groups = profile?.["cognito:groups"];
  return Array.isArray(groups) ? groups : groups ? [groups] : [];
}

function Dashboard({ profile, accessToken, onSignOut }) {
  const [apiResult, setApiResult] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [isCallingApi, setIsCallingApi] = useState(false);

  const callProtectedApi = async () => {
    if (!apiUrl || !accessToken) return;
    setIsCallingApi(true);
    setApiError(null);
    setApiResult(null);
    try {
      const response = await fetch(apiUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const body = await response.text();
      if (!response.ok)
        throw new Error(
          `API returned ${response.status}: ${body || response.statusText}`,
        );
      try {
        setApiResult(JSON.stringify(JSON.parse(body), null, 2));
      } catch {
        setApiResult(body || "API returned an empty successful response.");
      }
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Unable to call the API.",
      );
    } finally {
      setIsCallingApi(false);
    }
  };

  const name =
    [profile.given_name, profile.family_name].filter(Boolean).join(" ") ||
    profile.name ||
    profile.email ||
    profile.preferred_username ||
    profile.sub;
  const groups = readGroups(profile);

  return (
    <main className="page">
      <section className="card dashboard">
        <div className="dashboardHeader">
          <div>
            <p className="eyebrow">Session active</p>
            <h1>Hello, {name}</h1>
            <p className="muted">
              Cognito verified your identity; the access token is used for API
              access.
            </p>
          </div>
          <button className="secondary" onClick={onSignOut}>
            Sign out
          </button>
        </div>
        <dl className="profile">
          <div>
            <dt>Email</dt>
            <dd>{profile.email || "not provided"}</dd>
          </div>
          <div>
            <dt>Company</dt>
            <dd>{profile["custom:company"] || "not provided"}</dd>
          </div>
          <div>
            <dt>Verified</dt>
            <dd>{profile.email_verified ? "yes" : "no"}</dd>
          </div>
          <div>
            <dt>Cognito groups</dt>
            <dd>{groups.length ? groups.join(", ") : "none assigned"}</dd>
          </div>
        </dl>
        <section className="apiPanel" aria-labelledby="api-title">
          <div>
            <h2 id="api-title">Protected API test</h2>
            <p className="muted">
              {apiUrl
                ? `GET ${apiUrl}`
                : "Set VITE_API_URL to enable the API test."}
            </p>
          </div>
          <button
            className="primary"
            disabled={!apiUrl || isCallingApi}
            onClick={callProtectedApi}
          >
            {isCallingApi ? "Calling…" : "Call API"}
          </button>
        </section>
        {apiError && <pre className="result error">{apiError}</pre>}
        {apiResult && <pre className="result">{apiResult}</pre>}
      </section>
      <SecurityNote />
    </main>
  );
}

export default Dashboard;
