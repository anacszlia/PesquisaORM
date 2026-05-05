import { Request, Response } from 'express';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { usersTable } from '../db/schema';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';

const db = drizzle(process.env.DATABASE_URL!);

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });

  const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (existing) return res.status(409).json({ error: 'E-mail já cadastrado.' });

  const passwordHash = await hashPassword(password);
  const [user] = await db.insert(usersTable).values({ name, email, passwordHash }).returning();

  return res.status(201).json({ token: generateToken(user.id) });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas.' });

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Credenciais inválidas.' });

  return res.json({ token: generateToken(user.id) });
}
