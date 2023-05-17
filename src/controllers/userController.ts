import prisma from '../db';
import { comparePasswords, createJWT, hashPassword } from '../modules/auth';
import { Request, Response } from 'express';
import { verifiedUser } from '../types';

//get a specific user
export const getMe = async (req: Request, res: Response) => {
  console.log('This is the req.params: ', req.params);
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (user) {
    res.status(200).json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      monthlyBudget: user.monthlyBudget,
    });
  } else {
    res.status(401);
    throw new Error('User not in db');
  }
};

//create new user
export const createUser = async (req: Request, res: Response) => {
  console.log('Inside createuser!');
  console.log('This is req.body: ', req.body);
  const { email, password, firstName, lastName, monthlyBudget } = req.body;
  //check to make sure all form fields were submitted
  if (!email || !password || !firstName || !lastName || !monthlyBudget) {
    res.status(401);
    throw new Error('Need all fields populated');
  }
  console.log('This is email: ', email);
  //check if email is already registered to a user (user already exists)
  const userExists = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  console.log('After userExist check! ', userExists);
  //if there is no user in the db:
  if (!userExists) {
    //create the user
    //create salt for password encryption

    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        password: await hashPassword(req.body.password),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        monthlyBudget: req.body.monthlyBudget,
      },
    });
    console.log('this is the created User: ', user);
    //create a token for authentication
    const token: string = createJWT(user.id);
    console.log('this is token: ', token);
    //for security, only send up the id, email, monthly budget and token to the front
    const newUser: verifiedUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      monthlyBudget: user.monthlyBudget,
      token: token,
    };
    return res.status(200).json(newUser);
  } else {
    //If the user already exists, we need to throw an error
    res.status(401);
    throw new Error('User already exists!');
  }
};

//login a user
export const login = async (req: Request, res: Response) => {
  console.log('Inside login function of userController!');
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  console.log('This is the user from login: ', user);
  if (user && (await comparePasswords(req.body.password, user!.password))) {
    const token = createJWT(user.id);
    const authenticatedUser: verifiedUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      monthlyBudget: user.monthlyBudget,
      token: token,
    };
    res.status(200).json(authenticatedUser);
  } else {
    res.status(401);
    throw new Error('no user with this email exists');
  }
};

//update user info
export const updateUser = async (req: Request, res: Response) => {
  //get which part of the user object needs to be changed
  //data will be an object containing the field(s) that need to be updated
  const { email, data } = req.body;

  //iterate over data, make sure if email is needing to be changed that it isn't already in the db, since email is unique
  for (const key in data) {
    if (key === 'email') {
      const user = await prisma.user.findUnique({
        where: {
          email: data[key],
        },
      });
      if (user) {
        res.status(401);
        throw new Error(
          'Updated email already exists, cannot change to this email!'
        );
      } else {
        //since the email is the only unique value in the user table,
        //after checking that the user does not exist, I can break out of loop
        //and continue with updating the information
        break;
      }
    }
  }
  //update that part of the user object
  const updateUser = await prisma.user.update({
    where: {
      email: email,
    },
    data: data,
  });
  //return the updated object with a new generated token
  const token: string = createJWT(updateUser.id);
  console.log('this is token: ', token);
  //for security, only send up the id, email, monthly budget and token to the front
  const newUser: verifiedUser = {
    id: updateUser.id,
    email: updateUser.email,
    firstName: updateUser.firstName,
    monthlyBudget: updateUser.monthlyBudget,
    token: token,
  };
  return res.status(200).json(newUser);
};

//Delete user
export const deleteUser = async (req: Request, res: Response) => {
  const { email, id } = req.body;
  //Get user information to return after everything gets deleted
  const retrievedUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  //Need to delete all expense logs first, as this is relational data to the user table
  //check if there are expense logs for this account first
  const hasExpenses = await prisma.expense.findMany({
    where: {
      userId: id,
    },
  });
  //if there are expenses for this user, delete all of them
  if (hasExpenses[0] !== undefined) {
    const deleteUser = await prisma.$transaction([
      prisma.expense.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { email: email } }),
    ]);
  } else {
    const deleteUser = await prisma.user.delete({
      where: {
        email: email,
      },
    });
  }
  console.log('This is the deleted User: ', retrievedUser);
  res.status(200).json(retrievedUser);
};
