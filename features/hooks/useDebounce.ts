export const usePermissions = (role: string, allowed: string[]) =>
  allowed.includes(role);
