import "server-only";

export const ADMIN_ROLES = ["superadmin", "admin", "staff", "viewer"] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export interface RoleDefinition {
  label: string;
  description: string;
  permissions: readonly string[];
}

export const ROLE_LABELS: Record<AdminRole, string> = {
  superadmin: "Super Admin",
  admin: "Admin",
  staff: "Staff",
  viewer: "Viewer",
};

export const ROLES: Record<AdminRole, RoleDefinition> = {
  superadmin: {
    label: "Super Admin",
    description: "Full access to every module, settings and user management.",
    permissions: ["*"],
  },
  admin: {
    label: "Admin",
    description: "Manage content and operations across all modules.",
    permissions: [
      "dashboard.view",
      "profile.view",
      "profile.update",
      "password.change",
      "content.manage",
      "students.manage",
      "certificates.manage",
      "enquiries.manage",
    ],
  },
  staff: {
    label: "Staff",
    description: "Manage day-to-day content and student records.",
    permissions: [
      "dashboard.view",
      "profile.view",
      "profile.update",
      "password.change",
      "content.manage",
      "students.manage",
    ],
  },
  viewer: {
    label: "Viewer",
    description: "Read-only access to the dashboard and reports.",
    permissions: ["dashboard.view", "profile.view", "password.change"],
  },
};

const ROLE_RANK: Record<AdminRole, number> = {
  viewer: 0,
  staff: 1,
  admin: 2,
  superadmin: 3,
};

export function isAdminRole(value: string): value is AdminRole {
  return (ADMIN_ROLES as readonly string[]).includes(value);
}

export function hasPermission(role: AdminRole, permission: string): boolean {
  const definition = ROLES[role];
  if (!definition) return false;
  return definition.permissions.includes("*") || definition.permissions.includes(permission);
}

export function isRoleAtLeast(role: AdminRole, minimum: AdminRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}

export function canAccessDashboard(role: AdminRole): boolean {
  return hasPermission(role, "dashboard.view");
}
