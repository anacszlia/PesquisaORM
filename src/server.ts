import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import habitsRouter from './routes/habits';
import streaksRouter from './routes/streak';
import authRouter from './routes/authRoutes';
import usersRouter from './routes/users';


const app = express();
app.use(cors({ origin: ['http://localhost:5173', 'https://habits-site-qi893jazk-anacszlias-projects.vercel.app'] }));
app.use(express.json());

app.use('/auth', authRouter);
app.use('/habits', authRouter,habitsRouter);
app.use('/streaks', authRouter,streaksRouter);
app.use('/users', authRouter, usersRouter);


app.listen(3000, () => console.log('API rodando na porta 3000'));
app.get('/', (req, res) => {
  res.send('Bem-vindo à API de Hábitos e Streaks!');
});
