import { Navigate, Outlet } from 'react-router-dom';
import { can } from '@/lib/rbac';
import { useAuthStore } from '@/shared/hooks/useAuthStore';
import type { Permission } from '@/shared/types';

export const RoleGuard = ({ permission }: { permission: Permission }) => {
  const role = useAuthStore((s) => s.user?.role);
  if (!can(role, permission)) return <Navigate to="/app/dashboard" replace />;
  return <Outlet />;
};
