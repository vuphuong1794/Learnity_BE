// src/common/firebase-admin.provider.ts
import { Provider } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '../config/config.service';

export const FirebaseAdminProvider: Provider = {
  provide: 'FIREBASE_ADMIN',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    if (!admin.apps.length) {
      const firebaseConfig = configService.firebase;

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: firebaseConfig.projectId,
          privateKey: firebaseConfig.privateKey,
          clientEmail: firebaseConfig.clientEmail,
        }),
      });

      console.log('Firebase Admin initialized from config');
    }

    return admin;
  },
};
