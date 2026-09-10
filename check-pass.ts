import bcrypt from 'bcryptjs';
console.log(bcrypt.compareSync('Passw0rd!vibe', '$2b$12$N9oJlF7iNDKY15NiWN4ZceKuynuR3dNTdXBk.TWzKoDzoSD.j1mUa'));
