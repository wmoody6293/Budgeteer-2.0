import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import expenseReducer from '../features/expenses/expenseSlice';
import userReducer from '../features/user/userSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    expenseInfo: expenseReducer,
    user: userReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
