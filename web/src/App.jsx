import { useState } from "react";
import { useAuth } from "react-oidc-context";
import ConfirmationForm from "./components/ConfirmationForm";
import Dashboard from "./components/Dashboard";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import Landing from "./components/Landing";
import RegistrationForm from "./components/RegistrationForm";
import SignInForm from "./components/SignInForm";
import { Screen } from "./components/Shared";
import {
  profileFromIdToken,
  signOut as clearCognitoSession,
} from "./services/cognito";
import "./styles.css";

const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN?.replace(/\/$/, "");
const logoutUri = import.meta.env.VITE_LOGOUT_URI || window.location.origin;

function App() {
  const auth = useAuth();
  const [view, setView] = useState("landing");
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [customSession, setCustomSession] = useState(null);

  const signOut = async () => {
    await auth.removeUser();
    if (!cognitoDomain) return;
    const url = new URL(`${cognitoDomain}/logout`);
    url.searchParams.set("client_id", import.meta.env.VITE_COGNITO_CLIENT_ID);
    url.searchParams.set("logout_uri", logoutUri);
    window.location.assign(url.toString());
  };

  const customSignOut = () => {
    clearCognitoSession(customSession?.user);
    setCustomSession(null);
    setView("landing");
  };

  if (auth.isLoading || auth.activeNavigator === "signinRedirect") {
    return (
      <Screen
        title="Checking your session"
        text="Completing your secure Cognito sign-in…"
      />
    );
  }

  if (auth.error) {
    return (
      <Screen
        title="Sign-in failed"
        text={auth.error.message}
        actionLabel="Try again"
        onAction={() => auth.signinRedirect()}
      />
    );
  }

  if (auth.isAuthenticated) {
    return (
      <Dashboard
        profile={auth.user?.profile ?? {}}
        accessToken={auth.user?.access_token}
        onSignOut={signOut}
      />
    );
  }

  if (customSession) {
    return (
      <Dashboard
        profile={profileFromIdToken(customSession.idToken)}
        accessToken={customSession.accessToken}
        onSignOut={customSignOut}
      />
    );
  }

  if (view === "sign-in") {
    return (
      <SignInForm
        onBack={() => setView("landing")}
        onForgotPassword={() => setView("forgot-password")}
        onSignedIn={setCustomSession}
      />
    );
  }

  if (view === "register") {
    return (
      <RegistrationForm
        onBack={() => setView("landing")}
        onCreated={(email) => {
          setConfirmationEmail(email);
          setView("confirm");
        }}
      />
    );
  }

  if (view === "confirm") {
    return (
      <ConfirmationForm
        email={confirmationEmail}
        onBack={() => setView("register")}
    onConfirmed={() => setView("sign-in")}
      />
    );
  }

  if (view === "forgot-password") {
    return (
      <ForgotPasswordForm
        onBack={() => setView("landing")}
        onComplete={() => setView("sign-in")}
      />
    );
  }

  return (
    <Landing
      onSignIn={() => setView("sign-in")}
      onRegister={() => setView("register")}
    />
  );
}

export default App;
