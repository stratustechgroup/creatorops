import { createContext, useContext, useCallback, ReactNode } from "react";
import { useUser, useSignIn as useClerkSignIn, useClerk } from "@clerk/clerk-react";
import { getMarketingUrl } from "@/lib/hosts";

type ClerkUser = NonNullable<ReturnType<typeof useUser>["user"]>;

export type SignInResult =
  | { status: "complete" }
  | { status: "needs_second_factor"; supportedSecondFactors: { strategy: string }[] };

interface AuthContextType {
  user: ClerkUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  attemptSecondFactor: (strategy: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  attemptPasswordReset: (code: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Used when Clerk is not configured (landing page, public pages)
const nullAuthValue: AuthContextType = {
  user: null,
  loading: false,
  signIn: async () => {
    throw new Error("Authentication is not configured.");
  },
  attemptSecondFactor: async () => {
    throw new Error("Authentication is not configured.");
  },
  signOut: async () => {},
  requestPasswordReset: async () => {
    throw new Error("Authentication is not configured.");
  },
  attemptPasswordReset: async () => {
    throw new Error("Authentication is not configured.");
  },
};

function AuthProviderWithClerk({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  const { signIn: clerkSignIn, setActive } = useClerkSignIn();
  const { signOut: clerkSignOut } = useClerk();

  const signIn = useCallback(
    async (email: string, password: string): Promise<SignInResult> => {
      if (!clerkSignIn) throw new Error("Sign in not available");
      const result = await clerkSignIn.create({ identifier: email, password });

      if (result.status === "complete") {
        if (setActive) await setActive({ session: result.createdSessionId });
        return { status: "complete" };
      }

      if (result.status === "needs_second_factor") {
        // Clerk's typings expose supportedSecondFactors on the result; cast cautiously.
        const supportedSecondFactors =
          (result as unknown as { supportedSecondFactors?: { strategy: string }[] })
            .supportedSecondFactors ?? [];
        return { status: "needs_second_factor", supportedSecondFactors };
      }

      if (result.status === "needs_first_factor") {
        throw new Error(
          "Your account needs email verification. Check your inbox for a verification code from Clerk, or verify the account in the Clerk dashboard."
        );
      }
      if (result.status === "needs_identifier") {
        throw new Error("That email isn't recognized. Double-check the address.");
      }
      if (result.status === "needs_new_password") {
        throw new Error(
          "Your password needs to be reset before you can sign in. Use the 'Forgot password?' link to reset it."
        );
      }

      throw new Error(
        `Sign in incomplete (Clerk status: ${result.status}). Email hi@creatorops.io if this persists.`
      );
    },
    [clerkSignIn, setActive]
  );

  const attemptSecondFactor = useCallback(
    async (strategy: string, code: string) => {
      if (!clerkSignIn) throw new Error("Sign in not available");
      // Clerk's typed strategies are a string-literal union; cast cautiously to allow
      // "totp" | "backup_code" passed in by the caller without coupling to Clerk's internal type.
      const result = await clerkSignIn.attemptSecondFactor({
        strategy,
        code,
      } as unknown as Parameters<typeof clerkSignIn.attemptSecondFactor>[0]);

      if (result.status === "complete") {
        if (setActive) await setActive({ session: result.createdSessionId });
        return;
      }

      throw new Error(
        `Two-factor verification incomplete (status: ${result.status}). Try again or email hi@creatorops.io.`
      );
    },
    [clerkSignIn, setActive]
  );

  const signOut = useCallback(async () => {
    await clerkSignOut();
    // Force a full app reset so any cached state is cleared and the user lands on the marketing page.
    // On the dash subdomain, this redirects across origins to the apex marketing site.
    window.location.href = getMarketingUrl() + "/";
  }, [clerkSignOut]);

  const requestPasswordReset = useCallback(
    async (email: string) => {
      if (!clerkSignIn) throw new Error("Sign in not available");
      await clerkSignIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
    },
    [clerkSignIn]
  );

  const attemptPasswordReset = useCallback(
    async (code: string, newPassword: string) => {
      if (!clerkSignIn) throw new Error("Sign in not available");

      const verification = await clerkSignIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
      });

      // After verifying the code, set the new password.
      if (verification.status === "needs_new_password") {
        const reset = await clerkSignIn.resetPassword({ password: newPassword });
        if (reset.status === "complete") {
          if (setActive) await setActive({ session: reset.createdSessionId });
          return;
        }
        throw new Error(
          `Password reset incomplete (status: ${reset.status}). Try again or email hi@creatorops.io.`
        );
      }

      if (verification.status === "complete") {
        // Some Clerk configurations may complete in one step; sign the user in.
        if (setActive) await setActive({ session: verification.createdSessionId });
        return;
      }

      throw new Error(
        `Password reset incomplete (status: ${verification.status}). Try again or email hi@creatorops.io.`
      );
    },
    [clerkSignIn, setActive]
  );

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        loading: !isLoaded,
        signIn,
        attemptSecondFactor,
        signOut,
        requestPasswordReset,
        attemptPasswordReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const hasClerk = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!hasClerk) {
    return (
      <AuthContext.Provider value={nullAuthValue}>
        {children}
      </AuthContext.Provider>
    );
  }

  return <AuthProviderWithClerk>{children}</AuthProviderWithClerk>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
