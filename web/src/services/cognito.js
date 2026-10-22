import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from "amazon-cognito-identity-js";

const issuer = import.meta.env.VITE_COGNITO_ISSUER;
const userPoolId =
  import.meta.env.VITE_COGNITO_USER_POOL_ID ||
  (issuer ? new URL(issuer).pathname.split("/").filter(Boolean).at(-1) : "");

function getUserPool() {
  return new CognitoUserPool({
    UserPoolId: userPoolId,
    ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
  });
}

export function createAccount({
  email,
  password,
  firstName,
  lastName,
  company,
}) {
  const attributes = [
    ["email", email],
    ["given_name", firstName],
    ["family_name", lastName],
    ["custom:company", company],
  ].map(
    ([Name, Value]) => new CognitoUserAttribute({ Name, Value: Value.trim() }),
  );

  return new Promise((resolve, reject) => {
    getUserPool().signUp(
      email.trim(),
      password,
      attributes,
      null,
      (error, result) => (error ? reject(error) : resolve(result)),
    );
  });
}

export function confirmAccount(email, code) {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({
      Username: email.trim(),
      Pool: getUserPool(),
    });
    user.confirmRegistration(code.trim(), true, (error, result) =>
      error ? reject(error) : resolve(result),
    );
  });
}

export function resendConfirmationCode(email) {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({
      Username: email.trim(),
      Pool: getUserPool(),
    });
    user.resendConfirmationCode((error, result) =>
      error ? reject(error) : resolve(result),
    );
  });
}

export function requestPasswordReset(email) {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({
      Username: email.trim(),
      Pool: getUserPool(),
    });
    user.forgotPassword({
      onSuccess: resolve,
      onFailure: reject,
      inputVerificationCode: resolve,
    });
  });
}

export function confirmPasswordReset(email, code, password) {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({
      Username: email.trim(),
      Pool: getUserPool(),
    });
    user.confirmPassword(code.trim(), password, {
      onSuccess: resolve,
      onFailure: reject,
    });
  });
}

export function signIn(email, password) {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({
      Username: email.trim(),
      Pool: getUserPool(),
    });

    const details = new AuthenticationDetails({
      Username: email.trim(),
      Password: password,
    });

    user.authenticateUser(details, {
      onSuccess: (session) =>
        resolve({
          accessToken: session.getAccessToken().getJwtToken(),
          idToken: session.getIdToken().getJwtToken(),
          user,
        }),
      onFailure: reject,
      newPasswordRequired: () =>
        reject(
          new Error(
            "Your account requires a new password. Contact an administrator for assistance.",
          ),
        ),
      mfaRequired: () =>
        reject(
          new Error(
            "Multi-factor authentication is required for this account.",
          ),
        ),
      totpRequired: () =>
        reject(
          new Error("Authenticator verification is required for this account."),
        ),
    });
  });
}

export function signOut(user) {
  user?.signOut();
}

export function profileFromIdToken(idToken) {
  const payload = idToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  const bytes = Uint8Array.from(atob(payload), (character) =>
    character.charCodeAt(0),
  );
  return JSON.parse(new TextDecoder().decode(bytes));
}

export function friendlyError(error) {
  switch (error?.code) {
    case "UsernameExistsException":
      return "An account with this email already exists. Try signing in instead.";
    case "InvalidPasswordException":
      return "Choose a password with at least 8 characters, uppercase and lowercase letters, a number, and a special character.";
    case "CodeMismatchException":
      return "That confirmation code is incorrect.";
    case "ExpiredCodeException":
      return "That confirmation code has expired. Request a new code.";
    case "LimitExceededException":
      return "Too many attempts. Please wait a moment and try again.";
    case "UserNotFoundException":
      return "We could not complete that request. Check the email address and try again.";
    default:
      return error?.message || "Something went wrong. Please try again.";
  }
}
