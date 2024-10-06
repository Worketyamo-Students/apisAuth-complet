import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { accessTokenSecret } from '../keys/accesskey';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(403).send("Token required");

  try {
    const decoded = jwt.verify(token, accessTokenSecret);
    req.body = decoded;
    next();
  } catch (error) {
    return res.status(401).send("Invalid Token");
  }
};