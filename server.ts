import express from 'express';
import db from './db';
import router from './routes/user';
db;
const app: express.Application = express();
const PORT: number | string = process.env.PORT || 3000;

app.use(router)

app.listen(PORT, (): void => console.log('Listening on port', PORT));