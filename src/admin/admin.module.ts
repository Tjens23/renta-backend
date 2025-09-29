import { Module } from '@nestjs/common';
import { AdminSetupController } from './admin-setup.controller';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [RolesModule, UsersModule],
  controllers: [AdminSetupController],
})
export class AdminModule {}
