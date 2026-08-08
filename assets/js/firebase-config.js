/**
 * SEOX Records — Firebase configuration
 * =========================================================================
 * Fill this in with your own Firebase project's config to make demo
 * submissions sync to a real cloud database (Firestore) — so YOU can see
 * every submission on admin.html, from any visitor, on any device.
 *
 * Leave the placeholder values as-is and the site keeps working exactly
 * as before: submissions are saved only to the browser they were filled
 * in on (see README.md — "Submission form → getting replies").
 *
 * How to get these values (free tier is plenty for this):
 *   1. Go to https://console.firebase.google.com → Add project.
 *   2. Inside the project: Build → Firestore Database → Create database
 *      (start in production mode; region — pick the closest to you).
 *   3. Build → Authentication → Get started → enable "Email/Password".
 *      Then Users tab → Add user → create yourself an admin login.
 *   4. Project settings (gear icon) → General → "Your apps" → Add app →
 *      Web (</>) → register the app → copy the firebaseConfig object
 *      Firebase shows you and paste the values below.
 *   5. Firestore Database → Rules tab → paste the rules from README.md
 *      ("Firestore security rules") and click Publish.
 *   6. Authentication → Settings → Authorized domains → add the domain
 *      you're hosting on (e.g. yourname.github.io).
 *
 * Full walkthrough is in README.md under "Cloud submissions with Firebase".
 * =========================================================================
 */

window.SEOX_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBkjlJ5m-aWpf8kYvABZ-xXgU8xqer6ZsQ",
    authDomain: "project-5522a9b2-8396-4834-8a1.firebaseapp.com",
    projectId: "project-5522a9b2-8396-4834-8a1",
    storageBucket: "project-5522a9b2-8396-4834-8a1.firebasestorage.app",
    messagingSenderId: "552295702037",
    appId: "1:552295702037:web:48d18e043933987dd0b81c",
};
