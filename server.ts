import express from 'express';
import db from './db';
db;
const app: express.Application = express();
const PORT: number | string = process.env.PORT || 3000;



app.listen(PORT, (): void => console.log('Listening on port', PORT));