import { useState } from "react";
import {
  confirmPasswordReset,
  friendlyError,
  requestPasswordReset,
} from "../services/cognito";
import { Field } from "./Shared";

function ForgotPasswordForm({ onBack, onComplete }) {
  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestCode = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await requestPasswordReset(email);
      setStep("reset");
    } catch (requestError) {
      setError(friendlyError(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    try {
      await confirmPasswordReset(email, code, password);
      setMessage("Your password has been updated. You can sign in now.");
    } catch (requestError) {
      setError(friendlyError(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resend = async () => {
    setError("");
    setMessage("");
    try {
      await requestPasswordReset(email);
      setMessage("A new verification code was sent.");
    } catch (requestError) {
      setError(friendlyError(requestError));
    }
  };

  return (
    <main className="page">
      <section className="card formCard compact">
        <button className="backButton" onClick={onBack}>
          ← Back to sign in
        </button>
        {step === "request" ? (
          <>
            <p className="eyebrow">Password recovery</p>
            <h1>Reset your password</h1>
            <p className="lead">
              Enter the email address for your account. We will send you a
              verification code to reset your password.
            </p>
            <form className="form" onSubmit={requestCode}>
              <Field
                label="Email address"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
              {error && <p className="formError" role="alert">{error}</p>}
              <button className="primary formSubmit" disabled={isSubmitting}>
                {isSubmitting ? "Sending…" : "Send verification code"}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="eyebrow">Verification required</p>
            <h1>Create a new password</h1>
            <p className="lead">
              Enter the code sent to <strong>{email}</strong>, then choose a
              new password.
            </p>
            <form className="form" onSubmit={resetPassword}>
              <Field
                label="Verification code"
                name="code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                inputMode="numeric"
                autoComplete="one-time-code"
              />
              <Field
                label="New password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                hint="At least 8 characters with uppercase, lowercase, number, and special character."
              />
              <Field
                label="Confirm new password"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
              />
              {error && <p className="formError" role="alert">{error}</p>}
              {message && <p className="formSuccess">{message}</p>}
              {message ? (
                <button className="primary formSubmit" type="button" onClick={onComplete}>
                  Continue to sign in
                </button>
              ) : (
                <button className="primary formSubmit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating…" : "Update password"}
                </button>
              )}
            </form>
            {!message && (
              <button className="textButton" onClick={resend}>
                Resend code
              </button>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default ForgotPasswordForm;
