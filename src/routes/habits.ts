import { Router } from 'express';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { habitsTable, streaksTable } from '../db/schema';

const router = Router();
const db = drizzle(process.env.DATABASE_URL!);

router.post('/', async (req, res) => {
  const { userId, title, description } = req.body;
  const [habit] = await db
    .insert(habitsTable)
    .values({ userId, title, description })
    .returning();
  res.status(201).json(habit);
});

router.get('/', async (req, res) => {
  const habits = await db.select().from(habitsTable);
  res.json(habits);
});

router.get('/:id', async (req, res) => {
  const [habit] = await db
    .select()
    .from(habitsTable)
    .where(eq(habitsTable.id, Number(req.params.id)));
  if (!habit) return res.status(404).json({ error: 'Não encontrado' });
  res.json(habit);
});

router.put('/:id', async (req, res) => {
  const { title, description, active } = req.body;
  const [habit] = await db
    .update(habitsTable)
    .set({ title, description, active })
    .where(eq(habitsTable.id, Number(req.params.id)))
    .returning();
  res.json(habit);
});

router.delete('/:id', async (req, res) => {
  const [habit] = await db
    .delete(habitsTable)
    .where(eq(habitsTable.id, Number(req.params.id)))
    .returning();
  res.json(habit);
});

router.post('/:id/complete', async (req, res) => {
  const habit = await db
    .select()
    .from(habitsTable)
    .where(eq(habitsTable.id, Number(req.params.id)))
    .then(r => r[0]);

  if (!habit) return res.status(404).json({ error: 'Hábito não encontrado' });

  const [streak] = await db.select().from(streaksTable).where(eq(streaksTable.userId, habit.userId));

  const now = new Date();
  const lastLogin = streak?.lastLogin ? new Date(streak.lastLogin) : null;
  const diffDays = lastLogin
    ? Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  let newStreak = 1;
  if (diffDays === 1) newStreak = (streak.currentStreak ?? 0) + 1;
  else if (diffDays === 0) newStreak = streak.currentStreak; // mesmo dia, não altera

  const [updatedStreak] = streak
    ? await db
        .update(streaksTable)
        .set({ currentStreak: newStreak, lastLogin: now })
        .where(eq(streaksTable.userId, habit.userId))
        .returning()
    : await db
        .insert(streaksTable)
        .values({ userId: habit.userId, currentStreak: 1, lastLogin: now })
        .returning();

  res.json({ habit, streak: updatedStreak });
});

export default router;
