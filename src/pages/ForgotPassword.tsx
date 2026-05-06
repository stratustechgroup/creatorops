import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/landing/Logo";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

type Step = "request" | "verify" | "done";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { requestPasswordReset, attemptPasswordReset } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect to dashboard once the reset completes successfully.
  useEffect(() => {
    if (step !== "done") return;
    const t = setTimeout(() => navigate("/dashboard", { replace: true }), 1500);
    return () => clearTimeout(t);
  }, [step, navigate]);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      await requestPasswordReset(email.trim());
      setStep("verify");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send reset code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedCode = code.trim();
    if (trimmedCode.length < 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsLoading(true);
    try {
      await attemptPasswordReset(trimmedCode, newPassword);
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar hideNavLinks />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-3 mb-8">
            <Logo className="w-10 h-10" />
            <span className="text-xl font-semibold">Creator Ops</span>
          </Link>

          {/* Card */}
          <div className="p-6 border border-white/10 rounded-xl bg-card">
            {step === "request" && (
              <>
                <div className="mb-6">
                  <h1 className="text-xl font-semibold mb-1">Reset your password</h1>
                  <p className="text-sm text-muted-foreground">
                    Enter the email on your account and we'll send a reset code.
                  </p>
                </div>

                <form onSubmit={handleRequestSubmit} className="space-y-4">
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
                      autoFocus
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
                        Sending...
                      </>
                    ) : (
                      "Send reset code"
                    )}
                  </Button>
                </form>
              </>
            )}

            {step === "verify" && (
              <>
                <div className="mb-6">
                  <h1 className="text-xl font-semibold mb-1">Enter your reset code</h1>
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code we sent to {email || "your email"} and choose a new password.
                  </p>
                </div>

                <form onSubmit={handleVerifySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Reset code</Label>
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="At least 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      minLength={8}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Re-enter your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      minLength={8}
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
                        Resetting...
                      </>
                    ) : (
                      "Reset password"
                    )}
                  </Button>

                  <button
                    type="button"
                    className="w-full text-sm text-muted-foreground hover:underline"
                    onClick={() => {
                      setStep("request");
                      setError(null);
                      setCode("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    disabled={isLoading}
                  >
                    Use a different email
                  </button>
                </form>
              </>
            )}

            {step === "done" && (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold mb-1">Password reset</h1>
                  <p className="text-sm text-muted-foreground">
                    You're signed in. Taking you to your dashboard...
                  </p>
                </div>
                <Button
                  className="w-full"
                  onClick={() => navigate("/dashboard", { replace: true })}
                >
                  Continue to dashboard
                </Button>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-2 text-center text-xs text-muted-foreground">
            <p>
              Remember it after all?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
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
