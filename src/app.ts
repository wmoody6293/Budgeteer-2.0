import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import userRoute from './routes/userRoutes';
import expenseRoute from './routes/expenseRoutes';
import { handleInputErrors } from './modules/middleware';

dotenv.config();
const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//assign routes to paths
app.use('/api/users', userRoute);
app.use('/api/expense', expenseRoute);

app.listen(3000, () => console.log('Server running on port 3000...'));
