//axios creates HTTP request and performs a similar function that postman does
import axios from 'axios';

//We added a proxy to frontend package.json that will add http://localhost:8000 then tack on the url when
//making http requests
const API_URL = 'http://localhost:3000/api/users/';

//Create new Budget from Dashboard.jsx
const updateBudget = async (
  userId: number,
  newBudgetAmount: number,
  token: string
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const data = { monthlyBudget: newBudgetAmount };
  const response = await axios.put(API_URL + userId, data, config);
  localStorage.removeItem('user');
  localStorage.setItem('user', JSON.stringify(response.data));
  return response.data;
};

//Get Budget of user
const getUserBudget = async (userId: number, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + userId, config);
  return response.data;
};

//Delete user expense
const deleteUser = async (userId: number, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + userId, config);
  return response.data;
};

const userService = {
  updateBudget,
  getUserBudget,
  deleteUser,
};

export default userService;
