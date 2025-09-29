import { Module } from '@nestjs/common';
import { AdminSetupController } from './admin-setup.controller';
import { AdminDashboardController } from './admin-dashboard.controller';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [RolesModule, UsersModule],
  controllers: [AdminSetupController, AdminDashboardController],
})
export class AdminModule {}
