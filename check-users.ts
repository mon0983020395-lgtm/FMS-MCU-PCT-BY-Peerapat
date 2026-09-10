import { PrismaClient } from './src/generated/prisma/index.js';
const p = new PrismaClient();
p.user.findMany().then(r => console.log(r)).catch(console.error).finally(()=>p.$disconnect());
