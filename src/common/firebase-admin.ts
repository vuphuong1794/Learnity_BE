import * as admin from 'firebase-admin';

export function initializeFirebase() {
    // Kiểm tra xem Firebase đã được khởi tạo chưa
    if (admin.apps.length === 0) {
        let serviceAccount;

        if (process.env.isProd === "1") {
            // Trên production (Render), sử dụng environment variables
            serviceAccount = {
                type: "service_account",
                project_id: process.env.FIREBASE_PROJECT_ID,
                private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
                private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                client_email: process.env.FIREBASE_CLIENT_EMAIL,
                client_id: process.env.FIREBASE_CLIENT_ID,
                auth_uri: "https://accounts.google.com/o/oauth2/auth",
                token_uri: "https://oauth2.googleapis.com/token",
                auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
                client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
                universe_domain: "googleapis.com"
            };
        } else {
            // Trên local development, import file JSON
            try {
                serviceAccount = require('./learnity-firebase-admin.json');
            } catch (error) {
                console.error('Không tìm thấy file service account JSON cho development');
                throw error;
            }
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        });
    }
}

export default admin;