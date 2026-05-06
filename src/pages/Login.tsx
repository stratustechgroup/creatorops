import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Logo } from "@/components/landing/Logo";
import { urlForPath } from "@/lib/hosts";

type Stage = "credentials" | "second_factor";
type SecondFactorMode = "totp" | "backup_code";

const valueProps = [
  "Single sign-on across your worlds",
  "Role-based admin and support access",
  "Live ops dashboard with backups and incidents",
];

export default function Login() {
  const [stage, setStage] = useState<Stage>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [secondFactorMode, setSecondFactorMode] =
    useState<SecondFactorMode>("totp");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, attemptSecondFactor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/dashboard";

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
        const hasTotp = result.supportedSecondFactors.some(
          (f) => f.strategy === "totp",
        );
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
    <div className="min-h-screen bg-background">
      {/* Subtle ambient gradient — no aggressive mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/[0.03] pointer-events-none" />

      <div className="relative min-h-screen flex flex-col lg:flex-row">
        {/* Brand panel — desktop only */}
        <aside className="hidden lg:flex lg:w-[42%] xl:w-[44%] flex-col justify-between border-r border-white/[0.06] bg-card/30 px-12 py-10 relative overflow-hidden">
          {/* Glow accent */}
          <div className="absolute -top-32 -left-24 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

          <a
            href={urlForPath("/")}
            className="relative flex items-center gap-3 group w-fit"
          >
            <Logo className="w-8 h-8 transition-transform group-hover:scale-105" />
            <span className="font-semibold text-foreground tracking-tight">
              Creator Ops
            </span>
          </a>

          <div className="relative max-w-md">
            <p className="text-sm text-primary font-medium mb-4 tracking-wide">
              SIGN IN
            </p>
            <h2 className="text-3xl xl:text-4xl font-semibold tracking-tight leading-[1.1] mb-6">
              The production system for content creators.
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-8">
              Manage your worlds, review backups, triage incidents, and stay
              ahead of every recording session.
            </p>

            <ul className="space-y-3">
              {valueProps.map((prop) => (
                <li
                  key={prop}
                  className="flex items-center gap-3 text-sm text-foreground/80"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{prop}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative flex items-center gap-2 text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono">All systems operational</span>
          </div>
        </aside>

        {/* Auth panel */}
        <main className="flex-1 flex flex-col">
          {/* Mobile-only top brand strip */}
          <div className="lg:hidden flex items-center justify-between px-6 pt-6">
            <a
              href={urlForPath("/")}
              className="flex items-center gap-2 group"
            >
              <Logo className="w-7 h-7 transition-transform group-hover:scale-105" />
              <span className="font-semibold text-foreground tracking-tight">
                Creator Ops
              </span>
            </a>
            <span className="text-xs text-muted-foreground font-mono">
              Sign in
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-16">
            <div className="w-full max-w-sm">
              {stage === "credentials" ? (
                <>
                  <div className="mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight mb-2">
                      Welcome back
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Sign in to your Creator Ops dashboard.
                    </p>
                  </div>

                  <form
                    onSubmit={handleCredentialsSubmit}
                    className="space-y-5"
                    noValidate
                  >
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
                        autoComplete="email"
                        autoFocus
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link
                          to="/forgot-password"
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isLoading}
                          autoComplete="current-password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2.5 rounded-md">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{error}</span>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-10"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Signing in...
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-4">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight mb-2">
                      {secondFactorMode === "totp"
                        ? "Two-factor verification"
                        : "Enter a backup code"}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {secondFactorMode === "totp"
                        ? "Open your authenticator app and enter the 6-digit code."
                        : "Enter one of the backup codes you saved when setting up 2FA."}
                    </p>
                  </div>

                  <form
                    onSubmit={handleSecondFactorSubmit}
                    className="space-y-5"
                  >
                    {secondFactorMode === "totp" ? (
                      <div className="space-y-2">
                        <Label htmlFor="code" className="sr-only">
                          Authenticator code
                        </Label>
                        <div className="flex justify-center">
                          <InputOTP
                            maxLength={6}
                            value={code}
                            onChange={(v) => setCode(v)}
                            disabled={isLoading}
                            autoFocus
                            inputMode="numeric"
                            pattern="[0-9]*"
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="code">Backup code</Label>
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
                          className="font-mono"
                        />
                      </div>
                    )}

                    {error && (
                      <div className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2.5 rounded-md">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{error}</span>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-10"
                      disabled={
                        isLoading ||
                        (secondFactorMode === "totp" && code.length !== 6) ||
                        (secondFactorMode === "backup_code" && !code.trim())
                      }
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Verifying...
                        </>
                      ) : (
                        "Verify"
                      )}
                    </Button>

                    <div className="flex items-center justify-between text-xs">
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => {
                          setError(null);
                          setCode("");
                          setSecondFactorMode((m) =>
                            m === "totp" ? "backup_code" : "totp",
                          );
                        }}
                        disabled={isLoading}
                      >
                        {secondFactorMode === "totp"
                          ? "Use a backup code"
                          : "Use authenticator app"}
                      </button>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        onClick={resetToCredentials}
                        disabled={isLoading}
                      >
                        Back to sign in
                      </button>
                    </div>
                  </form>
                </>
              )}

              {/* Recovery footer */}
              <div className="mt-10 pt-6 border-t border-white/[0.06] space-y-2 text-center text-xs text-muted-foreground">
                <p>
                  Don't have an account?{" "}
                  <a
                    href={urlForPath("/apply")}
                    className="text-primary hover:underline"
                  >
                    Apply for Creator Ops
                  </a>
                </p>
                <p>
                  Questions?{" "}
                  <a
                    href="mailto:hi@creatorops.io"
                    className="text-primary hover:underline"
                  >
                    hi@creatorops.io
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Slim footer */}
          <footer className="px-6 py-4 lg:px-16 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>
              © {new Date().getFullYear()} Stratus Technology Group · Creator Ops
            </span>
            <div className="flex items-center gap-4">
              <a
                href={urlForPath("/privacy")}
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </a>
              <a
                href={urlForPath("/terms")}
                className="hover:text-foreground transition-colors"
              >
                Terms
              </a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
