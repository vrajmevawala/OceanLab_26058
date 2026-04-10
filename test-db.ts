import './env.ts';
import { db } from './packages/db/src/client.js';
import { users } from './packages/db/src/schema/index.js';

async function test() {
  console.log('Testing DB connection...');
  try {
    const result = await db.select().from(users).limit(1);
    console.log('Result:', result);
  } catch (err) {
    console.error('Test failed:', err);
  }
}

test();
