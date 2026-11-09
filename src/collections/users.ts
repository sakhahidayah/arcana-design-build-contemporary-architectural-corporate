import type { CollectionConfig } from 'payload'

// ponytail: bootstrap admins only; Editor RBAC belongs to the dedicated access task.
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: () => false,
  },
  fields: [{ name: 'name', type: 'text', required: true }],
}
