# RBAC API Documentation

## Overview

This API provides Role-Based Access Control (RBAC) functionality for the application. It includes user management, role management, and permission management with proper authentication and authorization.

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Initial Setup

### Initialize RBAC System

```http
POST /admin/setup/initialize
Content-Type: application/json

{
  "adminUsername": "admin",
  "adminPassword": "secure_password",
  "adminFirstName": "Admin",
  "adminLastName": "User"
}
```

This endpoint:

- Creates default roles (admin, user)
- Creates default permissions
- Creates the first admin user
- Should be called only once during initial setup

## Authentication Endpoints

### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "username": "newuser",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "secure_password"
}
```

Returns:

```json
{
  "access_token": "jwt_token_here"
}
```

## User Management (Admin Only)

### Get All Users

```http
GET /admin/users
Authorization: Bearer <admin_jwt_token>
```

### Get Specific User

```http
GET /admin/users/:id
Authorization: Bearer <admin_jwt_token>
```

### Delete User

```http
DELETE /admin/users/:id
Authorization: Bearer <admin_jwt_token>
```

### Assign Roles to User

```http
POST /admin/users/:id/roles
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "roleIds": [1, 2]
}
```

### Remove Role from User

```http
DELETE /admin/users/:userId/roles/:roleId
Authorization: Bearer <admin_jwt_token>
```

## Role Management (Admin Only)

### Create Role

```http
POST /roles
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "name": "moderator",
  "description": "Moderator role with limited admin access",
  "permissionIds": [1, 2, 3]
}
```

### Get All Roles

```http
GET /roles
Authorization: Bearer <admin_jwt_token>
```

### Get Specific Role

```http
GET /roles/:id
Authorization: Bearer <admin_jwt_token>
```

### Update Role

```http
PUT /roles/:id
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "name": "updated_name",
  "description": "Updated description",
  "permissionIds": [1, 2, 4]
}
```

### Delete Role

```http
DELETE /roles/:id
Authorization: Bearer <admin_jwt_token>
```

## Permission Management (Admin Only)

### Create Permission

```http
POST /roles/permissions
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "name": "edit_posts",
  "resource": "posts",
  "action": "update",
  "description": "Edit blog posts"
}
```

### Get All Permissions

```http
GET /roles/permissions/all
Authorization: Bearer <admin_jwt_token>
```

### Delete Permission

```http
DELETE /roles/permissions/:id
Authorization: Bearer <admin_jwt_token>
```

## Default Permissions

The system comes with these default permissions:

1. **manage_users** - Full user management
2. **view_users** - View users
3. **create_users** - Create users
4. **update_users** - Update users
5. **delete_users** - Delete users
6. **manage_roles** - Full role management
7. **view_dashboard** - View admin dashboard

## Default Roles

1. **admin** - Has all permissions
2. **user** - Has basic permissions (view_dashboard)

## Usage in Controllers

### Using Role-Based Guards

```typescript
@Controller('api/protected')
@UseGuards(AuthGuard, RolesGuard)
export class ProtectedController {
  @Get('admin-only')
  @Roles('admin')
  adminOnlyEndpoint() {
    return { message: 'Admin only content' };
  }
}
```

### Using Permission-Based Guards

```typescript
@Controller('api/protected')
@UseGuards(AuthGuard, PermissionsGuard)
export class ProtectedController {
  @Get('user-management')
  @RequirePermissions('manage_users')
  userManagementEndpoint() {
    return { message: 'User management content' };
  }
}
```

## Frontend Integration

For your admin panel frontend, you'll typically need:

1. **Login page** - Use `/auth/login`
2. **User management** - Use `/admin/users/*` endpoints
3. **Role management** - Use `/roles/*` endpoints
4. **Permission assignment** - Use role and user endpoints

### Example Frontend Flow

1. User logs in → Get JWT token
2. Check user roles/permissions → Determine UI access
3. Admin features → Use admin endpoints with proper permissions
4. Regular user features → Use regular user endpoints

## Error Responses

- **401 Unauthorized** - Invalid or missing JWT token
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **400 Bad Request** - Invalid request data

