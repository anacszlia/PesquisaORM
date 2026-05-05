import { Router } from 'express';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { usersTable } from '../db/schema';
import { hashPassword } from '../utils/auth';

const router = Router();
const db = drizzle(process.env.DATABASE_URL!);

router.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  const passwordHash = await hashPassword(password);
  const [user] = await db.insert(usersTable).values({ name, email, passwordHash }).returning();
  res.status(201).json(user);
});

router.get('/', async (req, res) => {
  const users = await db.select().from(usersTable);
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, Number(req.params.id)));
  if (!user) return res.status(404).json({ error: 'Não encontrado' });
  res.json(user);
});

router.put('/:id', async (req, res) => {
  const { name, email, password } = req.body;
  const data: any = { name, email };
  if (password) data.passwordHash = await hashPassword(password);
  const [user] = await db.update(usersTable).set(data).where(eq(usersTable.id, Number(req.params.id))).returning();
  res.json(user);
});

router.delete('/:id', async (req, res) => {
  const [user] = await db.delete(usersTable).where(eq(usersTable.id, Number(req.params.id))).returning();
  res.json(user);
});

export default router;
