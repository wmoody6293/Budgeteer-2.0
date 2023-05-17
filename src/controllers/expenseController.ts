import prisma from '../db';
import { Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
  user?: any;
}
//get a specific user
export const getExpenses = async (req: AuthenticatedRequest, res: Response) => {
  const expenses = await prisma.expense.findMany({
    where: {
      userId: req.user.id,
    },
  });
  res.status(200).json(expenses);
};

//create new expense
export const createExpense = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  console.log('this is the userId: ', req.user.id, typeof req.user.id);
  if (!req.body.date || !req.body.category || !req.body.amount) {
    res.status(400);
    throw new Error('Please send valid text field');
  }
  const dataObject = {
    date: req.body.date,
    category: req.body.category,
    amount: req.body.amount,
    userId: req.user.id,
  };
  const expense = await prisma.expense.create({
    data: dataObject,
  });
  res.status(200).json(expense);
};

//update expense info
export const updateExpense = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const expense = await prisma.expense.findUnique({
    where: {
      id: req.params.id,
    },
  });
  if (!expense) {
    res.status(400);
    throw new Error('Expense not found');
  }
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });
  // Check for user
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user matches the expense user
  if (expense.userId !== user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedExpense = await prisma.expense.update({
    where: {
      id: expense.id,
    },
    data: req.body,
  });
  res.status(200).json(updatedExpense);
};

//Delete expense
export const deleteExpense = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const expense = await prisma.expense.findUnique({
    where: {
      id: req.params.id,
    },
  });
  if (!expense) {
    res.status(400);
    throw new Error('Expense not found');
  }

  //Get user information to return after everything gets deleted
  const loggedUser = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });
  // Check that there is a user that is logged in
  if (!loggedUser) {
    res.status(401);
    throw new Error('User not found');
  }
  //Make sure the logged in user matches the user that made the expense log
  if (expense.userId !== loggedUser.id) {
    res.status(401);
    throw new Error('Logged in user not authorized to delete this expense');
  }
  await prisma.expense.delete({
    where: {
      id: expense.id,
    },
  });
  res.status(200).json({
    'Response:': { 'Message:': 'Deleted this expense:', 'Expense:': expense },
  });
};
