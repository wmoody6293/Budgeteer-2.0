import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import expenseService from './expenseService';
import {
  Expense,
  error,
  SingleExpense,
  ExpenseInitialState,
} from '../../types';
//initial state should contain each expense for every user, as well as
//a sum of all expense amounts for ValsDisplay, and a totalBudget value for valsDispaly
const initialState: ExpenseInitialState = {
  expenses: [],
  totalExpenses: 0,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: '',
};

//Create Expense function for ExpenseForm.jsx field:

export const createExpense = createAsyncThunk(
  'report/create',
  async (expenseData: Expense, thunkAPI) => {
    try {
      //@ts-ignore
      const token = thunkAPI.getState().auth.user.token;
      return await expenseService.createExpense(expenseData, token);
    } catch (error: error | any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user Expenses
export const getExpenses = createAsyncThunk(
  'report/getAll',
  async (_, thunkAPI) => {
    try {
      //@ts-ignore
      const token = thunkAPI.getState().auth.user.token;

      return await expenseService.getExpenses(token);
    } catch (error: error | any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Delete user Expense
export const deleteExpense = createAsyncThunk(
  'expense/delete',
  async (obj: SingleExpense, thunkAPI) => {
    const object = Object.assign({}, obj);
    try {
      //@ts-ignore
      const token = thunkAPI.getState().auth.user.token;
      const data = await expenseService.deleteExpense(obj.id, token);
      data.amount = object.amount;
      return data;
    } catch (error: error | any) {
      const message =
        (error.response && error.response.data && error.response.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createExpense.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.expenses.push(action.payload);
        state.totalExpenses += Number(action.payload.amount);
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getExpenses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getExpenses.fulfilled, (state, action) => {
        const allSortedExpenses = action.payload.sort(
          //@ts-ignore
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        state.isLoading = false;
        state.isSuccess = true;
        //@ts-ignore
        state.totalExpenses = action.payload.reduce((acc, expense) => {
          return acc + Number(expense.amount);
        }, 0);
        state.expenses = allSortedExpenses;
      })
      .addCase(getExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteExpense.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.totalExpenses -= Number(action.payload.amount);
        state.expenses = state.expenses.filter(
          (expense) => expense.id !== action.payload.id
        );
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = expenseSlice.actions;
export default expenseSlice.reducer;
