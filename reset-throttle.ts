import { PrismaClient } from './src/generated/prisma/index.js';
const p = new PrismaClient();
p.loginThrottle.deleteMany().then(r => console.log('Deleted throttles:', r)).catch(console.error).finally(()=>p.$disconnect());
