import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import userService from './userService';
import { userInitialState, error, BudgetData, loggedInUser } from '../../types';

//JSON.parse(localStorage.getItem('user') || '')
const user: loggedInUser = {
  id: 1,
  email: 'wmoody6293@gmail.com',
  firstName: 'Will',
  monthlyBudget: 8000,
  token: 'a;ldfkas;dlfkads;lfkj',
};
const initialState: userInitialState = {
  user: user ? user : null,
  userBudget: user.monthlyBudget,
  userError: false,
  userSuccess: false,
  userLoading: false,
  userMessage: '',
};

//update user budget
export const updateBudget = createAsyncThunk(
  'user/updateBudget',
  async (budgetData: BudgetData, thunkAPI) => {
    try {
      //@ts-ignore
      const token = thunkAPI.getState().auth.user.token;
      return await userService.updateBudget(
        user.id,
        budgetData.newMonthlyBudget,
        token
      );
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

// Get user budget
export const getBudget = createAsyncThunk(
  'user/getBudget',
  async (_, thunkAPI) => {
    try {
      //@ts-ignore
      const token = thunkAPI.getState().auth.user.token;
      return await userService.getUserBudget(user.id, token);
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

//Delete user
export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (_, thunkAPI) => {
    try {
      //@ts-ignore
      const token = thunkAPI.getState().auth.user.token;
      const data = await userService.deleteUser(user.id, token);
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

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateBudget.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.userLoading = false;
        state.userSuccess = true;
        state.user = action.payload;
        state.userBudget = action.payload.monthlybudget;
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.userLoading = false;
        state.userError = true;
        state.userMessage = action.payload;
      })
      .addCase(getBudget.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(getBudget.fulfilled, (state, action) => {
        state.userLoading = false;
        state.userSuccess = true;
        state.userBudget = action.payload.monthlyBudget;
      })
      .addCase(getBudget.rejected, (state, action) => {
        state.userLoading = false;
        state.userError = true;
        state.userMessage = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.userLoading = false;
        state.userSuccess = true;
        state.user = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.userLoading = false;
        state.userError = true;
        state.userMessage = action.payload;
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
