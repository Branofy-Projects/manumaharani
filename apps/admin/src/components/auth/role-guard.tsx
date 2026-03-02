"use client";

import { authHelpers } from '@repo/auth';

import { useAuth } from './auth-provider';

interface RoleGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAdmin?: boolean;
  requiredRole?: "admin" | "super_admin" | "user";
  requireSuperAdmin?: boolean;
}

export function RoleGuard({
  children,
  fallback = null,
  requireAdmin = false,
  requiredRole,
  requireSuperAdmin = false,
}: RoleGuardProps) {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <>{fallback}</>;
  }

  // Check specific role
  if (requiredRole && !authHelpers.hasRole(user, requiredRole)) {
    return <>{fallback}</>;
  }

  // Check admin role (admin or super_admin)
  if (requireAdmin && !authHelpers.isAdmin(user)) {
    return <>{fallback}</>;
  }

  // Check super admin role
  if (requireSuperAdmin && !authHelpers.isSuperAdmin(user)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Hook for checking roles in components
export function useRoleCheck() {
  const { user } = useAuth();

  return {
    hasRole: (role: string) => authHelpers.hasRole(user, role),
    isAdmin: () => authHelpers.isAdmin(user),
    isSuperAdmin: () => authHelpers.isSuperAdmin(user),
    userRole: user?.userRole || null,
  };
}
