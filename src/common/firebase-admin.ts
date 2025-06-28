import { Provider } from '@nestjs/common';
import * as admin from 'firebase-admin';

const isProd = process.env.isProd === '1';

export const FirebaseAdminProvider: Provider = {
    provide: 'FIREBASE_ADMIN',
    useFactory: () => {
        if (!admin.apps.length) {
            console.log('Initializing Firebase Admin SDK...');
            const serviceAccount = {
                type: 'service_account',
                project_id: process.env.FIREBASE_PROJECT_ID,
                private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
                private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                client_email: process.env.FIREBASE_CLIENT_EMAIL,
                client_id: process.env.FIREBASE_CLIENT_ID,
                auth_uri: 'https://accounts.google.com/o/oauth2/auth',
                token_uri: 'https://oauth2.googleapis.com/token',
                auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
                client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
                universe_domain: 'googleapis.com',
            }

            console.log('Service Account:', serviceAccount);

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
            });
        }

        return admin;
    },
};
