import admin from 'firebase-admin';
import { config } from './configs';

admin.initializeApp({
  credential: admin.credential.cert(config),
  storageBucket: 'jintou-d0ad5.appspot.com'
});

export default admin.storage().bucket();
