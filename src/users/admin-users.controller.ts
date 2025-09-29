import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Roles } from '../auth/roles.decorator';
import { RequirePermissions } from '../auth/permissions.decorator';
import { AssignRoleDto } from '../roles/dto/roles.dto';

@Controller('admin/users')
@UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions('view_users')
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @RequirePermissions('view_users')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  @RequirePermissions('delete_users')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }

  @Post(':id/roles')
  @RequirePermissions('manage_users')
  async assignRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { roleIds: number[] },
  ) {
    const user = await this.usersService.assignRoles(id, body.roleIds);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  @Delete(':userId/roles/:roleId')
  @RequirePermissions('manage_users')
  async removeRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ) {
    const user = await this.usersService.removeRole(userId, roleId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
