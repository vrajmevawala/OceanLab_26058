import './env.js';
if (process.env.CLERK_SECRET_KEY) {
    console.log('CLERK_SECRET_KEY:', JSON.stringify(process.env.CLERK_SECRET_KEY));
    console.log('CLERK_SECRET_KEY length:', process.env.CLERK_SECRET_KEY.length);
}
if (process.env.CLERK_JWT_KEY) {
    console.log('CLERK_JWT_KEY:', JSON.stringify(process.env.CLERK_JWT_KEY));
} else {
    console.log('CLERK_JWT_KEY missing');
}
process.exit(0);
