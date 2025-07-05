// src/common/firebase-admin.provider.ts
import { ConfigService } from '@nestjs/config';
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { Provider } from '@nestjs/common';

export const FirebaseAdminProvider: Provider = {
  provide: 'FIREBASE_ADMIN',
  useFactory: (configService: ConfigService) => {
    // ✅ Tránh gọi initializeApp nếu đã khởi tạo rồi
    const apps = getApps();

    if (!apps.length) {
      initializeApp({
        credential: cert({
          projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
          clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
          privateKey: configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
        }),
      });
    }

    return getApp(); // ✅ Trả về instance đã khởi tạo (mặc định)
  },
  inject: [ConfigService],
};
