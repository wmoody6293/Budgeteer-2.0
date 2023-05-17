import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import ExpenseForm from '../components/ExpenseForm';
// import ExpenseLog from '../components/ExpenseLog';
import Spinner from '../components/Spinner';
import { getExpenses, reset } from '../features/expenses/expenseSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  updateBudget,
  getBudget,
  reset as resetBudget,
} from '../features/user/userSlice';

function Dashboard() {
  const [budgetTotal, setBudgetTotal] = useState('');

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { expenses, totalExpenses, isLoading, isError, message } =
    useAppSelector((state) => state.expenseInfo);
  const { userBudget, userError, userLoading, userMessage } = useAppSelector(
    (state) => state.user
  );

  ///logout not working due to something with getExpenses() function. Inside ExpenseSlice we are getting
  //error that token not found
  const update = async () => {
    dispatch(getExpenses());
    dispatch(reset());
    dispatch(getBudget());
    dispatch(resetBudget());
  };
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (isError) {
      console.log(message);
    }
    if (userError) console.log(userMessage);

    dispatch(getExpenses());
    dispatch(reset());

    dispatch(getBudget());
    dispatch(resetBudget());
  }, [user, navigate, isError, message, dispatch, userMessage, userError]);
  return (
    <div>
      <h1>Dashboard!!</h1>
    </div>
  );
}

export default Dashboard;
