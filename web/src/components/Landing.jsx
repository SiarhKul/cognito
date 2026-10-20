import { SecurityNote } from "./Shared";

function Landing({ onSignIn, onRegister }) {
  return (
    <main className="page entryPage">
      <section className="entryStory" aria-labelledby="entry-title">
        <p className="eyebrow">AWS / Amazon Cognito</p>
        <h1 id="entry-title">Sign in to the protected application</h1>
        <p className="lead">
          Your identity is verified by Cognito before the application receives
          access.
        </p>
        <div className="authFlow" aria-label="Sign-in flow">
          <div className="flowNode">
            <span className="flowIndex">01</span>
            <span>
              <strong>Identity provider</strong>
              <small>Amazon Cognito</small>
            </span>
          </div>
          <span className="flowConnector" aria-hidden="true" />
          <div className="flowNode">
            <span className="flowIndex">02</span>
            <span>
              <strong>Protected app</strong>
              <small>Access with your token</small>
            </span>
          </div>
        </div>
      </section>
      <section className="entryAction" aria-labelledby="continue-title">
        <p className="eyebrow">Welcome</p>
        <h2 id="continue-title">Continue securely</h2>
        <p className="muted">
          Use your organization account, or create a profile to get started.
        </p>
        <div className="actions">
          <button className="primary" onClick={onSignIn}>
            Sign in with Cognito
          </button>
          <button className="secondary" onClick={onRegister}>
            Create an account
          </button>
        </div>
      </section>
      <SecurityNote />
    </main>
  );
}

export default Landing;
