// backend/src/routes/streaks.ts
import { Router } from 'express';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { streaksTable } from '../db/schema';

const router = Router();
const db = drizzle(process.env.DATABASE_URL!);

router.post('/', async (req, res) => {
  const { userId, currentStreak, lastLogin } = req.body;
  const [streak] = await db
    .insert(streaksTable)
    .values({ userId, currentStreak, lastLogin })
    .returning();
  res.status(201).json(streak);
});

router.get('/', async (req, res) => {
  const streaks = await db.select().from(streaksTable);
  res.json(streaks);
});

router.get('/:id', async (req, res) => {
  const [streak] = await db
    .select()
    .from(streaksTable)
    .where(eq(streaksTable.id, Number(req.params.id)));
  if (!streak) return res.status(404).json({ error: 'Não encontrado' });
  res.json(streak);
});

router.put('/:id', async (req, res) => {
  const { currentStreak, lastLogin } = req.body;
  const [streak] = await db
    .update(streaksTable)
    .set({ currentStreak, lastLogin })
    .where(eq(streaksTable.id, Number(req.params.id)))
    .returning();
  res.json(streak);
});

router.delete('/:id', async (req, res) => {
  const [streak] = await db
    .delete(streaksTable)
    .where(eq(streaksTable.id, Number(req.params.id)))
    .returning();
  res.json(streak);
});

export default router;
