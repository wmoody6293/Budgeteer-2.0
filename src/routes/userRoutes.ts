import { Router } from 'express';
import {
  getMe,
  createUser,
  login,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { protect } from '../modules/auth';

const router = Router();

router.post('/', createUser); //Create new user
router.post('/login', login); //login existing user
router.get('/:id', getMe); //retrieve specific user data
router.put('/:id', protect, updateUser); //update user information
router.delete('/:id', protect, deleteUser); //delete user and user's expense logs

export default router;
