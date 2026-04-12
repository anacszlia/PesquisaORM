import { drizzle } from 'drizzle-orm/neon-http';
import { eq , ne} from 'drizzle-orm';
import { usersTable, streaksTable } from './db/schema';

const db = drizzle(process.env.DATABASE_URL!);

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isYesterday(date: Date, today: Date) {
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return isSameDay(date, yesterday);
}

export async function createUser(name: string, email: string) {
  const [user] = await db.insert(usersTable).values({ name, email }).returning();

  await db.insert(streaksTable).values({ userId: user.id, currentStreak: 0 });

  console.log(` Usuário criado: ${user.name} (id: ${user.id})`);
  return user;
}

export async function recordLogin(userId: number) {
  const today = new Date();

  const [streak] = await db
    .select()
    .from(streaksTable)
    .where(eq(streaksTable.userId, userId));

  if (!streak) throw new Error(`Streak não encontrado para userId ${userId}`);

  const last = streak.lastLogin;

  if (last && isSameDay(last, today)) {
    console.log(` Login já registrado hoje. Streak atual: ${streak.currentStreak}`);
    return;
  }

  const newStreak =
    last && isYesterday(last, today) ? streak.currentStreak + 1 : 1;

  const action = !last? 'Primeiro login': isYesterday(last, today)? 'Manteve streak'
    : 'Streak resetado';

  await db
    .update(streaksTable)
    .set({ currentStreak: newStreak, lastLogin: today })
    .where(eq(streaksTable.userId, userId));

  console.log(` ${action} → Streak: ${newStreak} dia(s)`);
}

export async function getStreak(userId: number) {
   //desestruturação de array do js ,pega o primeiro elemento do array retornado pela query e coloca dentro da variável
  const [streak] = await db
    .select({
      name: usersTable.name,
      currentStreak: streaksTable.currentStreak,
      lastLogin: streaksTable.lastLogin,
    })
    .from(streaksTable)
    .innerJoin(usersTable, eq(streaksTable.userId, usersTable.id))
    .where(streaksTable.userId === userId);

  return streak;
}

export async function simulateMissedDay(userId: number) {
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  await db
    .update(streaksTable)
    .set({ lastLogin: twoDaysAgo })
    .where(eq(streaksTable.userId, userId));

  console.log(` Simulado: último login há 2 dias (streak será resetado no próximo login)`);
}

export async function listAllUsersWithStreak(){
  const streaks = await db
    .select({
      name: usersTable.name,
      currentStreak: streaksTable.currentStreak,
      lastLogin: streaksTable.lastLogin,
    })
    .from(streaksTable)
    .innerJoin(usersTable, eq(streaksTable.userId, usersTable.id))
    .where(ne(streaksTable.currentStreak,0))
  return streaks;

}