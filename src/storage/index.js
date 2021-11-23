import admin from 'firebase-admin';
import { config } from './configs';

admin.initializeApp({
  credential: admin.credential.cert(config),
  storageBucket: process.env.BUCKET_ID
});

export default admin.storage().bucket();
