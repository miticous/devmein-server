import base64 from 'base-64';

export const config = {
  type: 'service_account',
  project_id: process.env.FIREBASE_BUCKET_PROJECT_ID,
  private_key_id: process.env.FIREBASE_BUCKET_PROJECT_KEY_ID,
  private_key: base64.decode(process.env.FIREBASE_BUCKET_PRIVATE_KEY as string),
  client_email: process.env.FIREBASE_BUCKET_EMAIL,
  client_id: process.env.FIREBASE_BUCKET_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: process.env.FIREBASE_BUCKET_X509_CERT_URL
};
