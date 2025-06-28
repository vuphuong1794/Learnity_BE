// src/common/firebase-admin.module.ts
import { Module } from '@nestjs/common';
import { FirebaseAdminProvider } from './firebase-admin';

@Module({
    providers: [FirebaseAdminProvider],
    exports: [FirebaseAdminProvider], // Cho các module khác dùng
})
export class FirebaseAdminModule { }
