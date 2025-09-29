import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/Role';
import { Permission } from '../entities/Permission';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async createRole(
    name: string,
    description?: string,
    permissionIds?: number[],
  ): Promise<Role> {
    const role = new Role();
    role.name = name;
    if (description) {
      role.description = description;
    }

    if (permissionIds && permissionIds.length > 0) {
      const permissions =
        await this.permissionsRepository.findByIds(permissionIds);
      role.permissions = permissions;
    }

    return this.rolesRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.rolesRepository.find({ relations: ['permissions'] });
  }

  async findOne(id: number): Promise<Role | null> {
    return this.rolesRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
  }

  async findByName(name: string): Promise<Role | null> {
    return this.rolesRepository.findOne({
      where: { name },
      relations: ['permissions'],
    });
  }

  async updateRole(
    id: number,
    updateData: Partial<Role>,
    permissionIds?: number[],
  ): Promise<Role | null> {
    await this.rolesRepository.update(id, updateData);

    if (permissionIds !== undefined) {
      const role = await this.findOne(id);
      if (role) {
        if (permissionIds.length > 0) {
          const permissions =
            await this.permissionsRepository.findByIds(permissionIds);
          role.permissions = permissions;
        } else {
          role.permissions = [];
        }
        await this.rolesRepository.save(role);
      }
    }

    return this.findOne(id);
  }

  async deleteRole(id: number): Promise<void> {
    await this.rolesRepository.delete(id);
  }

  async createPermission(
    name: string,
    resource: string,
    action: string,
    description?: string,
  ): Promise<Permission> {
    const permission = new Permission();
    permission.name = name;
    permission.resource = resource;
    permission.action = action;
    if (description) {
      permission.description = description;
    }

    return this.permissionsRepository.save(permission);
  }

  async findAllPermissions(): Promise<Permission[]> {
    return this.permissionsRepository.find();
  }

  async findPermission(id: number): Promise<Permission | null> {
    return this.permissionsRepository.findOne({ where: { id } });
  }

  async deletePermission(id: number): Promise<void> {
    await this.permissionsRepository.delete(id);
  }

  async initializeDefaultRolesAndPermissions(): Promise<void> {
    // Create default permissions
    const permissions = [
      {
        name: 'manage_users',
        resource: 'users',
        action: 'manage',
        description: 'Full user management',
      },
      {
        name: 'view_users',
        resource: 'users',
        action: 'read',
        description: 'View users',
      },
      {
        name: 'create_users',
        resource: 'users',
        action: 'create',
        description: 'Create users',
      },
      {
        name: 'update_users',
        resource: 'users',
        action: 'update',
        description: 'Update users',
      },
      {
        name: 'delete_users',
        resource: 'users',
        action: 'delete',
        description: 'Delete users',
      },
      {
        name: 'manage_roles',
        resource: 'roles',
        action: 'manage',
        description: 'Full role management',
      },
      {
        name: 'view_dashboard',
        resource: 'dashboard',
        action: 'read',
        description: 'View admin dashboard',
      },
    ];

    for (const permData of permissions) {
      const existing = await this.permissionsRepository.findOne({
        where: { name: permData.name },
      });
      if (!existing) {
        await this.createPermission(
          permData.name,
          permData.resource,
          permData.action,
          permData.description,
        );
      }
    }

    // Create default roles
    const adminRole = await this.findByName('admin');
    if (!adminRole) {
      const allPermissions = await this.findAllPermissions();
      await this.createRole(
        'admin',
        'Administrator with full access',
        allPermissions.map((p) => p.id),
      );
    }

    const userRole = await this.findByName('user');
    if (!userRole) {
      const userPermissions = await this.permissionsRepository.find({
        where: { name: 'view_dashboard' },
      });
      await this.createRole(
        'user',
        'Regular user with limited access',
        userPermissions.map((p) => p.id),
      );
    }
  }
}
