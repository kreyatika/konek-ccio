
// Role permissions
export const rolePermissions = {
  superadmin: {
    create: true,
    read: true,
    update: true,
    delete: true,
    comment: true,
  },
  board: {
    create: true,
    read: true,
    update: true,
    delete: false,
    comment: true,
  },
  staff: {
    create: true,
    read: true,
    update: false,
    delete: false,
    comment: true,
  },
  member: {
    create: true,
    read: true,
    update: false,
    delete: false,
    comment: true,
  },
};
