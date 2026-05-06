import { Navigate } from "react-router-dom";
import { useStaffRole } from "@/hooks/useStaffRole";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isStaff, loading } = useStaffRole();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Checking permissions…</p>
      </div>
    );
  }

  if (!isStaff) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
