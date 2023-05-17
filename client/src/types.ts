export type newUser = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  monthlyBudget: number;
};

export type loginUser = {
  email: string;
  password: string;
};

export type authInitialState = {
  user: loggedInUser | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message?: string | null | any;
};
export type userInitialState = {
  user: loggedInUser | null;
  userBudget: number;
  userError: boolean;
  userSuccess: boolean;
  userLoading: boolean;
  userMessage?: string | null | any;
};
export type error = {
  response?:
    | {
        data?:
          | {
              message?: string | undefined;
            }
          | undefined;
      }
    | undefined;
  message?: string | undefined;
};

export type BudgetData = {
  newMonthlyBudget: number;
};

export type loggedInUser = {
  id: number;
  email: string;
  firstName: string;
  monthlyBudget: number;
  token: string;
};

export type Expense = {
  id: string;
  date: string;
  category: string;
  amount: string;
  userId: number;
};

export type SingleExpense = {
  id: string;
  amount: string;
};

export type ExpenseInitialState = {
  expenses: Expense[];
  totalExpenses: number;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  message?: string | null | any;
};
