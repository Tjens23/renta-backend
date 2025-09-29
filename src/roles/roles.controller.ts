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
import { RolesService } from './roles.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  CreateRoleDto,
  UpdateRoleDto,
  CreatePermissionDto,
} from './dto/roles.dto';

@Controller('roles')
@UseGuards(AuthGuard, RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Roles('admin')
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(
      createRoleDto.name,
      createRoleDto.description,
      createRoleDto.permissionIds,
    );
  }

  @Get()
  @Roles('admin')
  async getAllRoles() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Roles('admin')
  async getRole(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @Put(':id')
  @Roles('admin')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const { permissionIds, ...updateData } = updateRoleDto;
    return this.rolesService.updateRole(id, updateData, permissionIds);
  }

  @Delete(':id')
  @Roles('admin')
  async deleteRole(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.deleteRole(id);
  }

  @Post('permissions')
  @Roles('admin')
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return this.rolesService.createPermission(
      createPermissionDto.name,
      createPermissionDto.resource,
      createPermissionDto.action,
      createPermissionDto.description,
    );
  }

  @Get('permissions/all')
  @Roles('admin')
  async getAllPermissions() {
    return this.rolesService.findAllPermissions();
  }

  @Delete('permissions/:id')
  @Roles('admin')
  async deletePermission(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.deletePermission(id);
  }

  @Post('initialize')
  @Roles('admin')
  async initializeDefaults() {
    await this.rolesService.initializeDefaultRolesAndPermissions();
    return { message: 'Default roles and permissions initialized' };
  }
}
