import * as AppleAuthentication from "expo-apple-authentication";
import type { GoogleSignin as GoogleSigninType } from "@react-native-google-signin/google-signin";
import { AuthProvider, AuthSession } from "../../domain/entities/auth";
import { appConfig } from "../../core/config";
import { Logger } from "../../data/utils/logger";
import { AuthRepositoryImpl } from "../../data/repositories/AuthRepositoryImpl";

// ---------------------------------------------------------------------------
// Lazy Google Sign-In accessor — avoids touching the native module at load time
// ---------------------------------------------------------------------------
function getGoogleSignin(): {
  GoogleSignin: typeof GoogleSigninType;
  statusCodes: Record<string, string>;
} {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@react-native-google-signin/google-signin");
}

let googleConfigured = false;
function ensureGoogleConfigured() {
  if (googleConfigured) return;
  const { GoogleSignin } = getGoogleSignin();
  GoogleSignin.configure({
    iosClientId:
      process.env.GOOGLE_CLIENT_ID_IOS ??
      "101209994670-9t9qc1onn47n9j52g83o9qik77ur3d12.apps.googleusercontent.com",
  });
  googleConfigured = true;
}

// ---------------------------------------------------------------------------
// Apple Sign-In
// ---------------------------------------------------------------------------
async function appleSignIn(): Promise<{
  identityToken: string;
  email: string | null;
  fullName: string | null;
}> {
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  if (!credential.identityToken) {
    throw new Error("Apple Sign In failed: no identity token returned.");
  }

  const fullName = credential.fullName
    ? [credential.fullName.givenName, credential.fullName.familyName]
        .filter(Boolean)
        .join(" ") || null
    : null;

  if (appConfig.env !== "prod") {
    Logger.tag("SIGN IN - APPLE").log("credential --> ", credential);
  }

  return {
    identityToken: credential.identityToken,
    email: credential.email ?? null,
    fullName,
  };
}

// ---------------------------------------------------------------------------
// Google Sign-In
// ---------------------------------------------------------------------------
async function googleSignIn(): Promise<{
  idToken: string;
  email: string;
  name: string | null;
}> {
  ensureGoogleConfigured();
  const { GoogleSignin } = getGoogleSignin();
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();

  // SDK v12+ returns { type, data }; earlier returns the user object directly
  const userInfo = "data" in response ? response.data : response;

  if (!userInfo?.idToken) {
    throw new Error("Google Sign In failed: no ID token returned.");
  }

  if (appConfig.env !== "prod") {
    Logger.tag("SIGN IN - GOOGLE").log("userInfo --> ", userInfo);
  }

  return {
    idToken: userInfo.idToken,
    email: userInfo.user.email,
    name: userInfo.user.name ?? null,
  };
}

// ---------------------------------------------------------------------------
// Sentinel error thrown when the user cancels the native sign-in sheet
// ---------------------------------------------------------------------------
export class SignInCancelledError extends Error {
  constructor() {
    super("Sign in cancelled by user.");
    this.name = "SignInCancelledError";
  }
}

/** Normalises provider-specific cancellation codes into SignInCancelledError. */
function rethrow(e: unknown): never {
  const code = (e as { code?: string })?.code;
  const GOOGLE_CANCELLED = getGoogleSignin().statusCodes.SIGN_IN_CANCELLED;
  if (code === "ERR_CANCELED" || code === GOOGLE_CANCELLED) {
    throw new SignInCancelledError();
  }
  throw e;
}

// ---------------------------------------------------------------------------
// Unified sign-in — triggers the native SDK then posts to the backend
// ---------------------------------------------------------------------------
export async function signInWithProvider(
  provider: AuthProvider,
): Promise<AuthSession> {
  if (provider === "apple") {
    let identityToken: string;
    try {
      const result = await appleSignIn();
      identityToken = result.identityToken;
    } catch (e) {
      rethrow(e);
    }
    return AuthRepositoryImpl.loginWithApple(identityToken!);
  }

  if (provider === "google") {
    let idToken: string;
    try {
      const result = await googleSignIn();
      idToken = result.idToken;
    } catch (e) {
      rethrow(e);
    }
    return AuthRepositoryImpl.loginWithGoogle(idToken!);
  }

  throw new Error(`Unsupported provider: ${provider}`);
}
