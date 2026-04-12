/*
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { usersTable } from './db/schema';
  
const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  const user: typeof usersTable.$inferInsert = {
    name: 'John',
    email: 'john@example.com',
  };

  await db.insert(usersTable).values(user);
  console.log('New user created!')

  const users = await db.select().from(usersTable);
  console.log('Getting all users from the database: ', users)
  
  const users: {
    id: number;
    name: string;
    email: string;
  }[]
  

  await db
    .update(usersTable)
    .set({
      age: 31,
    })
    .where(eq(usersTable.email, user.email));
  console.log('User info updated!')

  await db.delete(usersTable).where(eq(usersTable.email, user.email));
  console.log('User deleted!')
}

main();
*/


import 'dotenv/config';
import { createUser, recordLogin, getStreak, simulateMissedDay,listAllUsersWithStreak } from './streak';

async function main() {
  console.log('\n--- 1. Criando usuário ---');
  const user = await createUser('jurema', 'jurema@example.com');
  
  console.log('\n--- 2. Primeiro login (streak começa em 1) ---');
  await recordLogin(user.id);

  console.log('\n--- 3. Login duplicado no mesmo dia (ignorado) ---');
  await recordLogin(user.id);

  console.log('\n--- 4. Simulando dia perdido ---');
  await simulateMissedDay(user.id);

  console.log('\n--- 5. Login após dia perdido (streak reseta para 1) ---');
  await recordLogin(user.id);

  console.log('\n--- 6. Estado final do streak ---');
  const streak = await getStreak(user.id);
  console.log(streak);

  console.log('\n--- 7. Listando todos os usuários com streak ---');
  const streaks = await listAllUsersWithStreak();
  console.log(streaks);
}

main().catch(console.error);
