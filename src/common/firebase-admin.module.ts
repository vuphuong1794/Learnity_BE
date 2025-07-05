// src/common/firebase-admin.module.ts
import { Module } from '@nestjs/common';
import { FirebaseAdminProvider } from './firebase-admin.provider';
import { ConfigModule } from '../config/config.module'; // ✅ đúng module bạn tự viết

@Module({
  imports: [ConfigModule],
  providers: [FirebaseAdminProvider],
  exports: [FirebaseAdminProvider],
})
export class FirebaseAdminModule {}
