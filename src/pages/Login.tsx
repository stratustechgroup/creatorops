import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
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

const stageMotion = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.2, ease: "easeOut" as const },
};

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
        // Clerk's supportedSecondFactors typically lists strategies that need
        // server-side preparation (phone_code, email_code). TOTP and backup
        // codes don't need prep, so they often DON'T appear here. Default to
        // TOTP (the common case) — user can switch to backup code via the
        // toggle. Only flip to backup_code if it's explicitly the only option.
        const onlyBackupCode =
          result.supportedSecondFactors.length > 0 &&
          result.supportedSecondFactors.every(
            (f) => f.strategy === "backup_code",
          );
        setSecondFactorMode(onlyBackupCode ? "backup_code" : "totp");
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
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <a
            href={urlForPath("/")}
            className="flex flex-col items-center gap-3 mb-12 group w-fit mx-auto"
          >
            <Logo className="w-10 h-10 transition-transform group-hover:scale-105" />
            <span className="font-semibold text-foreground tracking-tight">
              Creator Ops
            </span>
          </a>

          {/* Stage content */}
          <AnimatePresence mode="wait" initial={false}>
            {stage === "credentials" ? (
              <motion.div
                key="credentials"
                {...stageMotion}
                className="bg-card/50 border border-white/[0.06] rounded-xl p-8 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_8px_24px_-12px_rgba(0,0,0,0.6)]"
              >
                <div className="mb-7 text-center">
                  <h1 className="text-xl font-semibold tracking-tight">
                    Sign in to Creator Ops
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    Welcome back.
                  </p>
                </div>

                <form
                  onSubmit={handleCredentialsSubmit}
                  className="space-y-4"
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

                  <p className="pt-2 text-center text-xs text-muted-foreground">
                    Trouble signing in?{" "}
                    <a
                      href="mailto:hi@creatorops.io"
                      className="text-primary hover:underline"
                    >
                      hi@creatorops.io
                    </a>
                  </p>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="second_factor"
                {...stageMotion}
                className="bg-card/50 border border-white/[0.06] rounded-xl p-8 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_8px_24px_-12px_rgba(0,0,0,0.6)]"
              >
                <div className="mb-6 text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-4">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h1 className="text-xl font-semibold tracking-tight">
                    {secondFactorMode === "totp"
                      ? "Two-factor verification"
                      : "Enter a backup code"}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    {secondFactorMode === "totp"
                      ? "Enter the 6-digit code from your authenticator app."
                      : "Enter one of the backup codes you saved when setting up 2FA."}
                  </p>
                </div>

                <form
                  onSubmit={handleSecondFactorSubmit}
                  className="space-y-4"
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

                  <div className="flex items-center justify-between text-xs pt-1">
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

                  <p className="pt-2 text-center text-xs text-muted-foreground">
                    Trouble signing in?{" "}
                    <a
                      href="mailto:hi@creatorops.io"
                      className="text-primary hover:underline"
                    >
                      hi@creatorops.io
                    </a>
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-5 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
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
    </div>
  );
}
