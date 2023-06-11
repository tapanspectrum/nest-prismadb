import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports:[JwtModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
