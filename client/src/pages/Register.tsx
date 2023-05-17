import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { useNavigate } from 'react-router-dom';
import { register, reset } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';
import { FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    monthlyBudget: '',
    password: '',
    password2: '',
  });

  const { firstName, lastName, monthlyBudget, email, password, password2 } =
    formData;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, isLoading, isError, isSuccess, message } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      console.log('error in useEffect');
    }
    if (isSuccess || user) {
      navigate('/');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);
  //array above are all things redux watches and if any of them change, it fires off

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error('Passwords do not match');
    } else {
      const userData = {
        firstName,
        lastName,
        monthlyBudget: Number(monthlyBudget),
        email,
        password,
      };
      dispatch(register(userData));
    }
  };
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <>
      <section className="heading">
        <h1>
          <FaUser />
          Register
        </h1>
        <p>
          Create an account and start <strong>saving</strong> today!
        </p>
      </section>
      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="firstName"
              name="firstName"
              value={firstName}
              placeholder="Provide your broke ass first name"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="lastName"
              name="lastName"
              value={lastName}
              placeholder="Provide your broke ass last name"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              className="form-control"
              id="monthlyBudget"
              name="monthlyBudget"
              value={monthlyBudget}
              placeholder="8000"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="email"
              name="email"
              value={email}
              placeholder="codesmithRules@gmail.com"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              placeholder="Enter your secret password here... We won't peek. Probably..."
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password2"
              name="password2"
              value={password2}
              placeholder="Confirm your password...if you dare"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-block">
              Submit
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Register;
