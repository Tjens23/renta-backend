import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User';
import { Role } from 'src/entities/Role';
import { Repository } from 'typeorm';
import { hashPassword } from 'src/Utils/auth';

type UserType = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Role) private rolesRepository: Repository<Role>,
  ) {}

  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions'],
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username },
      relations: ['roles', 'roles.permissions'],
    });
  }

  async createUser(user: UserType): Promise<User> {
    const password = await hashPassword(user.password);
    const newUser = this.usersRepository.create({ ...user, password });

    // Assign default 'user' role
    const userRole = await this.rolesRepository.findOne({
      where: { name: 'user' },
    });
    if (userRole) {
      newUser.roles = [userRole];
    }

    return this.usersRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['roles'] });
  }

  async deleteUser(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async assignRoles(userId: number, roleIds: number[]): Promise<User | null> {
    const user = await this.findOne(userId);
    if (!user) {
      return null;
    }

    const roles = await this.rolesRepository.findByIds(roleIds);
    user.roles = roles;

    return this.usersRepository.save(user);
  }

  async removeRole(userId: number, roleId: number): Promise<User | null> {
    const user = await this.findOne(userId);
    if (!user) {
      return null;
    }

    user.roles = user.roles.filter((role) => role.id !== roleId);
    return this.usersRepository.save(user);
  }

  async updateUser(id: number, updateData: Partial<UserType>): Promise<User> {
    await this.usersRepository.update(id, updateData);
    const user = await this.findOne(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }
}
