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
import { createUser, recordLogin, getStreak, simulateMissedDay, listAllUsersWithStreak } from './streak';
import { createHabit, getHabitsByUser, getHabitById, updateHabit, deleteHabit } from './habit';

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

  // CRUD de hábitos
  console.log('\n--- 8. Criando hábitos ---');
  const h1 = await createHabit(user.id, 'Ler 30 minutos', 'Leitura diária antes de dormir');
  const h2 = await createHabit(user.id, 'Exercício');

  console.log('\n--- 9. Listando hábitos do usuário ---');
  const habits = await getHabitsByUser(user.id);
  console.log(habits);

  console.log('\n--- 10. Buscando hábito por id ---');
  const found = await getHabitById(h1.id);
  console.log(found);

  console.log('\n--- 11. Atualizando hábito ---');
  await updateHabit(h1.id, { title: 'Ler 1 hora', active: true });

  console.log('\n--- 12. Deletando hábito ---');
  await deleteHabit(h2.id);

  console.log('\n--- 13. Hábitos após deleção ---');
  console.log(await getHabitsByUser(user.id));
}

main().catch(console.error);
