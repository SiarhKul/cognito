import { useState } from "react";
import {
  confirmAccount,
  friendlyError,
  resendConfirmationCode,
} from "../services/cognito";
import { Field } from "./Shared";

function ConfirmationForm({ email, onBack, onConfirmed }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await confirmAccount(email, code);
      onConfirmed();
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
      await resendConfirmationCode(email);
      setMessage("A new confirmation code was sent.");
    } catch (requestError) {
      setError(friendlyError(requestError));
    }
  };

  return (
    <main className="page">
      <section className="card formCard compact">
        <button className="backButton" onClick={onBack}>
          ← Back
        </button>
        <p className="eyebrow">Confirm your email</p>
        <h1>Check your inbox</h1>
        <p className="lead">
          Enter the confirmation code sent to <strong>{email}</strong>.
        </p>
        <form className="form" onSubmit={submit}>
          <Field
            label="Confirmation code"
            name="code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            inputMode="numeric"
            autoComplete="one-time-code"
          />
          {error && (
            <p className="formError" role="alert">
              {error}
            </p>
          )}
          {message && <p className="formSuccess">{message}</p>}
          <button className="primary formSubmit" disabled={isSubmitting}>
            {isSubmitting ? "Confirming…" : "Confirm account"}
          </button>
        </form>
        <button className="textButton" onClick={resend}>
          Resend code
        </button>
      </section>
    </main>
  );
}

export default ConfirmationForm;
