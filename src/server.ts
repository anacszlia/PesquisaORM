import 'dotenv/config';
import express from 'express';
import habitsRouter from './routes/habits';
import streaksRouter from './routes/streak';
import authRouter from './routes/authRoutes';
const app = express();
app.use(express.json());

app.use('/auth', authRouter);
app.use('/habits', habitsRouter);
app.use('/streaks', streaksRouter);


app.listen(3000, () => console.log('API rodando na porta 3000'));
app.get('/', (req, res) => {
  res.send('Bem-vindo à API de Hábitos e Streaks!');
});
