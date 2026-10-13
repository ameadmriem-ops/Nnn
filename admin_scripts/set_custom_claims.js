/**
 * Firebase Admin SDK script to set Admin Custom Claim for ameadmriem@gmail.com
 *
 * Usage:
 * 1. Download Service Account JSON from Firebase Console -> Project Settings -> Service accounts
 * 2. Save as serviceAccountKey.json in this directory
 * 3. Run: npm install firebase-admin && node set_custom_claims.js
 */

const admin = require('firebase-admin');
let serviceAccount;

try {
  serviceAccount = require('./serviceAccountKey.json');
} catch (e) {
  console.log("No serviceAccountKey.json found. Make sure to download it from Firebase Console.");
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  const adminEmail = 'ameadmriem@gmail.com';

  async function grantAdminRole() {
    try {
      const user = await admin.auth().getUserByEmail(adminEmail);
      if ((user.email || '').toLowerCase() !== adminEmail || user.emailVerified !== true) {
        throw new Error(`Refusing to grant admin: ${adminEmail} must be the exact, email-verified account.`);
      }
      await admin.auth().setCustomUserClaims(user.uid, { admin: true, role: 'ADMIN' });
      console.log(`Success! Granted Admin custom claims to verified account: ${adminEmail} (UID: ${user.uid})`);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        console.log(`User ${adminEmail} not registered yet. Create the account in app/console first, then run this script.`);
      } else {
        console.error('Error setting custom claims:', err);
      }
    }
  }

  grantAdminRole();
} else {
  console.log("Please provide serviceAccountKey.json to run this script.");
}
