//axios creates HTTP request and performs a similar function that postman does
import axios from 'axios';
import { newUser, loginUser } from '../../types';
//We added a proxy to frontend package.json that will add http://localhost:8000 then tack on the url when
//making http requests
const API_URL = 'http://localhost:3000/api/users/';

//Register user
const register = async (userData: newUser) => {
  //userData is given on Register page
  const response = await axios.post(API_URL, userData);
  //axios puts the response inside an object called data
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

//Login user
const login = async (userData: loginUser) => {
  console.log('Inside AuthService Login Function!!');
  //userData is given on login page
  const response = await axios.post(API_URL + 'login', userData);
  //axios puts the response inside an object called data
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
