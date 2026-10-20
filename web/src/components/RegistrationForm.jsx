import { useState } from "react";
import { createAccount, friendlyError } from "../services/cognito";
import { Field } from "./Shared";

function RegistrationForm({ onBack, onCreated }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    try {
      await createAccount(form);
      onCreated(form.email.trim());
    } catch (requestError) {
      setError(friendlyError(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page">
      <section className="card formCard">
        <button className="backButton" onClick={onBack}>
          ← Back
        </button>
        <p className="eyebrow">Create account</p>
        <h1>Set up your profile</h1>
        <p className="lead">
          All fields are required. We will send a confirmation code to your
          email address.
        </p>
        <form className="form" onSubmit={submit}>
          <div className="twoColumns">
            <Field
              label="First name"
              name="firstName"
              value={form.firstName}
              onChange={update}
              autoComplete="given-name"
            />
            <Field
              label="Last name"
              name="lastName"
              value={form.lastName}
              onChange={update}
              autoComplete="family-name"
            />
          </div>
          <Field
            label="Company"
            name="company"
            value={form.company}
            onChange={update}
            maxLength={200}
            autoComplete="organization"
          />
          <Field
            label="Email address"
            name="email"
            value={form.email}
            onChange={update}
            type="email"
            autoComplete="email"
          />
          <Field
            label="Password"
            name="password"
            value={form.password}
            onChange={update}
            type="password"
            autoComplete="new-password"
            hint="At least 8 characters with uppercase, lowercase, number, and special character."
          />
          <Field
            label="Confirm password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={update}
            type="password"
            autoComplete="new-password"
          />
          {error && (
            <p className="formError" role="alert">
              {error}
            </p>
          )}
          <button className="primary formSubmit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account…" : "Create account"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default RegistrationForm;
