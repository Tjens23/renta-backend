import { Module, forwardRef } from '@nestjs/common';
import { AdminSetupController } from './admin-setup.controller';
import { AdminDashboardController } from './admin-dashboard.controller';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    RolesModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: configService.get<string>('jwt.expiresIn') },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => AuthModule),
  ],
  controllers: [AdminSetupController, AdminDashboardController],
})
export class AdminModule {}
