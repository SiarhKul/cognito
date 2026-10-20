import { useState } from "react";
import { friendlyError, signIn } from "../services/cognito";
import { Field } from "./Shared";

function SignInForm({ onBack, onForgotPassword, onSignedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await onSignedIn(await signIn(email, password));
    } catch (requestError) {
      setError(friendlyError(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page">
      <section className="card formCard compact">
        <button className="backButton" onClick={onBack}>
          ← Back
        </button>
        <p className="eyebrow">Secure sign in</p>
        <h1>Welcome back</h1>
        <p className="lead">
          Sign in with your account to access the protected application.
        </p>
        <form className="form" onSubmit={submit}>
          <Field
            label="Email address"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
          />
          <Field
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
          {error && <p className="formError" role="alert">{error}</p>}
          <button className="primary formSubmit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <button className="textButton" onClick={onForgotPassword}>
          Forgot password?
        </button>
      </section>
    </main>
  );
}

export default SignInForm;
