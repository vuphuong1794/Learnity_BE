import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Otp, OtpSchema } from 'src/schemas/otp.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { FirebaseAdminProvider } from '../common/firebase-admin.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
    ConfigModule, // 👈 THÊM DÒNG NÀY
  ],
  controllers: [AuthController],
  providers: [AuthService, FirebaseAdminProvider],
})
export class AuthModule {}
