# RBAC Access Control Summary

## 🔐 Access Levels

### 👤 Regular Users (Role: "user")

**CAN Access:**

- ✅ `/auth/login` - Login
- ✅ `/auth/register` - Register new account
- ✅ `/auth/profile` - View own profile
- ✅ `/auth/logout` - Logout

**CANNOT Access (403 Forbidden):**

- ❌ `/admin/dashboard` - Admin dashboard
- ❌ `/admin/dashboard/quick-stats` - Dashboard statistics
- ❌ `/admin/users` - User management
- ❌ `/admin/users/:id` - View specific user
- ❌ `/admin/users/:id/roles` - Assign roles
- ❌ `/roles` - Role management
- ❌ `/roles/permissions` - Permission management

### 👑 Admin Users (Role: "admin")

**CAN Access Everything:**

- ✅ All regular user endpoints
- ✅ All admin endpoints
- ✅ Full CRUD operations on users, roles, and permissions

## 🛡️ Permission System

### Default Permissions:

1. **`view_profile`** - View own profile (Regular users have this)
2. **`view_dashboard`** - Access admin dashboard (Admins only)
3. **`manage_users`** - Full user management (Admins only)
4. **`view_users`** - View users (Admins only)
5. **`create_users`** - Create users (Admins only)
6. **`update_users`** - Update users (Admins only)
7. **`delete_users`** - Delete users (Admins only)
8. **`manage_roles`** - Role management (Admins only)

### Role Assignments:

- **Admin Role**: Gets ALL permissions
- **User Role**: Gets ONLY `view_profile` permission

## 🧪 Security Testing

### Quick Test Commands:

```bash
# 1. Create and login as regular user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "test123", "firstName": "Test", "lastName": "User"}'

curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "test123"}'

# Save the token from above
TOKEN="your_token_here"

# 2. Test regular user access (should work)
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer $TOKEN"

# 3. Test admin access (should fail with 403)
curl -X GET http://localhost:3000/admin/dashboard \
  -H "Authorization: Bearer $TOKEN"

curl -X GET http://localhost:3000/admin/users \
  -H "Authorization: Bearer $TOKEN"

curl -X GET http://localhost:3000/roles \
  -H "Authorization: Bearer $TOKEN"
```

### Expected Results:

- ✅ Profile access: `200 OK`
- ❌ Admin dashboard: `403 Forbidden`
- ❌ User management: `403 Forbidden`
- ❌ Role management: `403 Forbidden`

## 🔒 Frontend Implementation

### For your admin panel frontend:

```javascript
// Check if user can access admin features
const userPermissions = user.roles.flatMap((role) =>
  role.permissions.map((permission) => permission.name),
);

const canViewDashboard = userPermissions.includes('view_dashboard');
const canManageUsers = userPermissions.includes('manage_users');

// Show/hide admin UI elements based on permissions
if (canViewDashboard) {
  // Show admin dashboard
} else {
  // Redirect to regular user area or show access denied
}
```

### Navigation Guard Example:

```javascript
// Route guard for admin pages
const adminRoutes = ['/admin', '/dashboard', '/users', '/roles'];
const currentRoute = window.location.pathname;

if (adminRoutes.some((route) => currentRoute.startsWith(route))) {
  if (!userPermissions.includes('view_dashboard')) {
    // Redirect to unauthorized page or user dashboard
    window.location.href = '/unauthorized';
  }
}
```

## 🚨 Security Notes

1. **Regular users have NO admin access** - They can only view their own profile
2. **All admin endpoints require specific permissions** - Not just authentication
3. **Role-based AND permission-based guards** - Double layer of security
4. **JWT tokens don't grant admin access** - Must have proper role/permissions
5. **Frontend should hide admin UI** - But backend enforces the security

This ensures your admin panel is completely secure from regular users! 🔒
