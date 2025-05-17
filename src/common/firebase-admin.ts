import * as admin from 'firebase-admin';
import * as serviceAccount from './learnity-firebase-admin.json';

export function initializeFirebase() {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
}

export default admin;