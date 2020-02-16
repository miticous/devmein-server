import admin from 'firebase-admin';
import credential from './Jintou-d3c43a5c474a.json';

admin.initializeApp({
  credential: admin.credential.cert(credential),
  storageBucket: 'jintou-d0ad5.appspot.com'
});

export default admin.storage().bucket();
