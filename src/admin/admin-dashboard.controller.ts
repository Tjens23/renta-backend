import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermissions } from '../auth/permissions.decorator';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';

@Controller('admin/dashboard')
@UseGuards(AuthGuard, PermissionsGuard)
export class AdminDashboardController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  @Get()
  @RequirePermissions('view_dashboard')
  async getDashboardStats() {
    const users = await this.usersService.findAll();
    const roles = await this.rolesService.findAll();
    const permissions = await this.rolesService.findAllPermissions();

    return {
      message: 'Admin Dashboard - Authorized Access Only',
      stats: {
        totalUsers: users.length,
        totalRoles: roles.length,
        totalPermissions: permissions.length,
        userBreakdown: users.reduce(
          (acc, user) => {
            const roleNames = user.roles?.map((role) => role.name) || [
              'no-role',
            ];
            roleNames.forEach((roleName) => {
              acc[roleName] = (acc[roleName] || 0) + 1;
            });
            return acc;
          },
          {} as Record<string, number>,
        ),
      },
      adminFeatures: {
        userManagement: '/admin/users',
        roleManagement: '/roles',
        permissionManagement: '/roles/permissions/all',
      },
    };
  }

  @Get('quick-stats')
  @RequirePermissions('view_dashboard')
  async getQuickStats() {
    const users = await this.usersService.findAll();

    return {
      totalUsers: users.length,
      adminUsers: users.filter((user) =>
        user.roles?.some((role) => role.name === 'admin'),
      ).length,
      regularUsers: users.filter((user) =>
        user.roles?.some((role) => role.name === 'user'),
      ).length,
      timestamp: new Date().toISOString(),
    };
  }
}
