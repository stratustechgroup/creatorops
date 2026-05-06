import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/landing/Logo";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { urlForPath } from "@/lib/hosts";
import { AlertCircle, Loader2 } from "lucide-react";

type Stage = "credentials" | "second_factor";
type SecondFactorMode = "totp" | "backup_code";

export default function Login() {
  const [stage, setStage] = useState<Stage>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [secondFactorMode, setSecondFactorMode] = useState<SecondFactorMode>("totp");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, attemptSecondFactor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn(email, password);
      if (result.status === "complete") {
        navigate(from, { replace: true });
        return;
      }
      if (result.status === "needs_second_factor") {
        // Default to TOTP; if the account only supports backup codes, switch to that.
        const hasTotp = result.supportedSecondFactors.some((f) => f.strategy === "totp");
        setSecondFactorMode(hasTotp ? "totp" : "backup_code");
        setCode("");
        setStage("second_factor");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecondFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await attemptSecondFactor(secondFactorMode, code.trim());
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const resetToCredentials = () => {
    setStage("credentials");
    setCode("");
    setError(null);
    setSecondFactorMode("totp");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar hideNavLinks />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <a href={urlForPath("/")} className="flex items-center justify-center gap-3 mb-8">
            <Logo className="w-10 h-10" />
            <span className="text-xl font-semibold">Creator Ops</span>
          </a>

          {/* Login Card */}
          <div className="p-6 border border-white/10 rounded-xl bg-card">
            {stage === "credentials" ? (
              <>
                <div className="mb-6">
                  <h1 className="text-xl font-semibold mb-1">Welcome back</h1>
                  <p className="text-sm text-muted-foreground">
                    Sign in to access your dashboard
                  </p>
                </div>

                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <h1 className="text-xl font-semibold mb-1">
                    {secondFactorMode === "totp"
                      ? "Enter your authenticator code"
                      : "Enter a backup code"}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {secondFactorMode === "totp"
                      ? "Open your authenticator app and enter the 6-digit code."
                      : "Enter one of the backup codes you saved when setting up 2FA."}
                  </p>
                </div>

                <form onSubmit={handleSecondFactorSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">
                      {secondFactorMode === "totp" ? "Authenticator code" : "Backup code"}
                    </Label>
                    {secondFactorMode === "totp" ? (
                      <Input
                        id="code"
                        type="text"
                        placeholder="123456"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        autoComplete="one-time-code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        disabled={isLoading}
                        autoFocus
                      />
                    ) : (
                      <Input
                        id="code"
                        type="text"
                        placeholder="xxxx-xxxx"
                        autoComplete="off"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        disabled={isLoading}
                        autoFocus
                      />
                    )}
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify"
                    )}
                  </Button>

                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => {
                        setError(null);
                        setCode("");
                        setSecondFactorMode((m) => (m === "totp" ? "backup_code" : "totp"));
                      }}
                      disabled={isLoading}
                    >
                      {secondFactorMode === "totp"
                        ? "Use a backup code"
                        : "Use authenticator app"}
                    </button>
                    <button
                      type="button"
                      className="text-muted-foreground hover:underline"
                      onClick={resetToCredentials}
                      disabled={isLoading}
                    >
                      Back to sign in
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          <div className="mt-6 space-y-2 text-center text-xs text-muted-foreground">
            <p>
              Need an account?{" "}
              <a href={urlForPath("/apply")} className="text-primary hover:underline">
                Apply for Creator Ops
              </a>
            </p>
            <p>
              Questions?{" "}
              <a href="mailto:hi@creatorops.io" className="text-primary hover:underline">
                hi@creatorops.io
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
