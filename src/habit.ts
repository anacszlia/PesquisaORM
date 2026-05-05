import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { habitsTable } from './db/schema';

const db = drizzle(process.env.DATABASE_URL!);

export async function createHabit(userId: number, title: string, description?: string) {
  const [habit] = await db
    .insert(habitsTable)
    .values({ userId, title, description })
    .returning();
  console.log(` Hábito criado: "${habit.title}" (id: ${habit.id})`);
  return habit;
}

export async function getHabitsByUser(userId: number) {
  return db.select().from(habitsTable).where(eq(habitsTable.userId, userId));
}

export async function getHabitById(id: number) {
  const [habit] = await db.select().from(habitsTable).where(eq(habitsTable.id, id));
  return habit;
}
export async function updateHabit(id: number, data: { title?: string; description?: string; active?: boolean }) {
  const [habit] = await db
    .update(habitsTable)
    .set(data)
    .where(eq(habitsTable.id, id))
    .returning();
  console.log(` Hábito atualizado: "${habit.title}"`);
  return habit;
}

export async function deleteHabit(id: number) {
  const [habit] = await db
    .delete(habitsTable)
    .where(eq(habitsTable.id, id))
    .returning();
  console.log(` Hábito removido: "${habit.title}"`);
  return habit;
}
