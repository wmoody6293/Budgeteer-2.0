//axios creates HTTP request and performs a similar function that postman does
import { Expense } from '../../types';
import axios from 'axios';

//making http requests
const API_URL = 'http://localhost:3000/api/expense';

//Create new Expense from ExpenseForm.jsx
const createExpense = async (expenseData: Expense, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, expenseData, config);
  return response.data;
};

//Get All Expenses of user
const getExpenses = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

//update user expense
const updateExpense = async (
  expenseId: string,
  expenseData: Expense,
  token: string
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL + expenseId, expenseData, config);
  return response.data;
};

//Delete user expense
const deleteExpense = async (expenseId: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + expenseId, config);
  return response.data;
};

const expenseService = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};

export default expenseService;
