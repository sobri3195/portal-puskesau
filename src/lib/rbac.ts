import type { Permission, Role } from '@/shared/types';

const rolePermissions: Record<Role, Permission[]> = {
  ADMIN: ['dashboard:view', 'nota:view', 'nota:create', 'nota:edit', 'nota:export', 'documents:view', 'documents:upload', 'documents:approve', 'agenda:view', 'agenda:manage', 'directory:view', 'phase2:view'],
  TU: ['dashboard:view', 'nota:view', 'nota:create', 'nota:edit', 'nota:export', 'documents:view', 'documents:upload', 'agenda:view', 'agenda:manage', 'directory:view', 'phase2:view'],
  PEJABAT: ['dashboard:view', 'nota:view', 'nota:create', 'nota:edit', 'nota:export', 'documents:view', 'documents:upload', 'documents:approve', 'agenda:view', 'agenda:manage', 'directory:view', 'phase2:view'],
  NAKES: ['dashboard:view', 'nota:view', 'documents:view', 'agenda:view', 'directory:view', 'phase2:view'],
  LOGISTIK: ['dashboard:view', 'nota:view', 'documents:view', 'agenda:view', 'directory:view', 'phase2:view'],
  AUDITOR: ['dashboard:view', 'nota:view', 'documents:view', 'agenda:view', 'directory:view', 'phase2:view'],
  VIEWER: ['dashboard:view', 'nota:view', 'documents:view', 'agenda:view', 'directory:view'],
};

export const can = (role: Role | undefined, permission: Permission): boolean => {
  if (!role) return false;
  return rolePermissions[role]?.includes(permission) ?? false;
};
