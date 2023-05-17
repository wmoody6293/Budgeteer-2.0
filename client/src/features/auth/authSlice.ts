import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import authService from './authService';
import { authInitialState, error, loginUser, newUser } from '../../types';

//@ts-ignore
const user = JSON.parse(localStorage.getItem('user'));
// {
//   id: 1,
//   email: 'wmoody6293@gmail.com',
//   firstName: 'Will',
//   monthlyBudget: 8000,
//   token: 'a;ldfkas;dlfkads;lfkj',
// };

const initialState: authInitialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const register = createAsyncThunk(
  'auth/register',
  async (user: newUser, thunkAPI) => {
    try {
      if (user !== null) {
        //@ts-ignore
        const data = await authService.register(user);
        return data;
      }
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

export const login = createAsyncThunk(
  'auth/login',
  async (user: loginUser, thunkAPI) => {
    try {
      //@ts-ignore
      console.log('Inside authSlice login function!');
      const data = await authService.login(user);
      return data;
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

export const logout = createAsyncThunk('auth/logout', async (state) => {
  await authService.logout();
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        //in register func above, successful register cases send the user info back
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        //in register func above, on error cases, a message is returned
        state.message = action.payload;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        //in login func above, successful login cases send the user info back
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        //in login func above, on error cases, a message is returned
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
