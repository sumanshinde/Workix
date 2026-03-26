/**
 * PRE-FLIGHT PRODUCTION CHECKLIST
 * This script verifies that all critical environment variables are set for a stable launch.
 */

const requiredEnv = [
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_RAZORPAY_KEY_ID'
];

console.log('--- BHARATGIG PRODUCTION READINESS PROBE ---');

let missing = 0;
requiredEnv.forEach(env => {
  if (!process.env[env] || process.env[env] === 'your-variable-here') {
    console.warn(`[❌] MISSING: ${env}`);
    missing++;
  } else {
    // Basic mask for secrets
    const val = process.env[env];
    const masked = val.length > 8 ? val.substring(0, 4) + '...' + val.substring(val.length - 4) : '********';
    console.log(`[✅] DETECTED: ${env} (${masked})`);
  }
});

if (missing === 0) {
  console.log('\nCORE INFRASTRUCTURE: STABLE');
} else {
  console.error(`\nCRITICAL: ${missing} variables are unset. Production will fail.`);
}

console.log('\n--- 🚀 PROBE COMPLETE ---');
