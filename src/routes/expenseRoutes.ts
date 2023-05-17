import { Router } from 'express';
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController';
import { protect } from '../modules/auth';

const router = Router();

router.get('/', protect, getExpenses); //retrieve specific expense data
router.post('/', protect, createExpense); //Create new expense
router.put('/:id', protect, updateExpense); //update expense information
router.delete('/:id', protect, deleteExpense); //delete expense

export default router;
