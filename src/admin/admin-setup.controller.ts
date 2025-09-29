import { Controller, Post, Body } from '@nestjs/common';
import { RolesService } from '../roles/roles.service';
import { UsersService } from '../users/users.service';
import { hashPassword } from '../Utils/auth';

@Controller('admin/setup')
export class AdminSetupController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
  ) {}

  @Post('initialize')
  async initializeSystem(
    @Body()
    body: {
      adminUsername: string;
      adminPassword: string;
      adminFirstName: string;
      adminLastName: string;
    },
  ) {
    // Initialize roles and permissions
    await this.rolesService.initializeDefaultRolesAndPermissions();

    // Check if admin user already exists
    const existingAdmin = await this.usersService.findByUsername(
      body.adminUsername,
    );
    if (existingAdmin) {
      return { message: 'Admin user already exists' };
    }

    // Create admin user
    const hashedPassword = await hashPassword(body.adminPassword);
    const adminUser = await this.usersService.createUser({
      username: body.adminUsername,
      password: body.adminPassword, // Will be hashed in the service
      firstName: body.adminFirstName,
      lastName: body.adminLastName,
    });

    // Assign admin role
    const adminRole = await this.rolesService.findByName('admin');
    if (adminRole) {
      await this.usersService.assignRoles(adminUser.id, [adminRole.id]);
    }

    return {
      message: 'RBAC system initialized successfully',
      adminUserId: adminUser.id,
      adminUsername: adminUser.username,
    };
  }
}
