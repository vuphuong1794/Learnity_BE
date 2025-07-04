import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Otp, OtpSchema } from 'src/schemas/otp.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { firebaseAdminProvider } from '../notification/firebase-admin.provider';

@Module({
  imports: [MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }])],
  controllers: [AuthController],
  providers: [AuthService, firebaseAdminProvider],
})
export class AuthModule { }
