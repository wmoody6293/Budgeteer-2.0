import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

//interface for modified requests
interface AuthenticatedRequest extends Request {
  user?: any;
}

export const comparePasswords = (password: string | Buffer, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = async (password: string | Buffer) => {
  const saltVal: string = await bcrypt.genSalt(10);
  return bcrypt.hash(password, saltVal);
};

export const createJWT = (id: number) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  return token;
};

export const protect = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  //get the bearer token from req.headers
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.json({ message: 'not authorized' });
    return;
  }
  //Bearer will be a string with 'Bearer: token-string' format, and I want just the token string
  //here I split the string at the space, and get the token-string half
  const token = bearer.split(' ')[1];

  if (!token) {
    res.status(401);
    res.json({ message: 'Invalid Token' });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    console.log('This is user in protect! ', user);
    req.user = user;
    console.log('This is req.user: ', req.user);
    next();
  } catch (e) {
    console.error(e);
    res.status(401);
    res.json({ message: 'Invalid Token' });
    return;
  }
};
