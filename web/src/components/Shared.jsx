export function Field({ label, hint, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input required {...props} />
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function Screen({ title, text, actionLabel, onAction }) {
  return (
    <main className="page">
      <section className="card hero compact">
        <p className="eyebrow">AWS · Amazon Cognito</p>
        <h1>{title}</h1>
        <p className="lead">{text}</p>
        {actionLabel && (
          <button className="primary" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </section>
    </main>
  );
}

export function SecurityNote() {
  return (
    <p className="securityNote">
      Tokens are intentionally not displayed or logged in the interface.
    </p>
  );
}
