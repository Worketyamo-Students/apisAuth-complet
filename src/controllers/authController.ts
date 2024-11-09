import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { accessTokenSecret,  } from '../keys/accesskey';
import {refreshTokenSecret} from '../keys/refreshkey';
import { sendOtpEmail } from '../services/emailService';
import { generateOtp, verifyOtp } from '../services/optService';
import { format } from 'date-fns';
import { isDateBeforeNow } from '../services/formatService';
import { HttpCode } from '../core/constants';
import { validationResult } from 'express-validator';
const prisma = new PrismaClient
export const getAllUsers = async (req:Request,res:Response)=>{
  try {
    const user = await prisma.user.findMany()
    if(!user){
      res.status(HttpCode.NO_CONTENT).send(HttpCode.NO_CONTENT)
    } else{
      res.status(HttpCode.OK).send(user)
    }
  } catch (error) {
    console.log(error)
  }
};

export const  getUserById = async (req:Request,res:Response)=>{
  try {
    const {id} = req.params;
    const user = await prisma.user.findUnique({
      where:{
        id:id
      }
    })
    if(!user){
      res.status(HttpCode.NOT_FOUND).send(HttpCode.NOT_FOUND)
  } else {
    res.status(HttpCode.OK).send(user)
  }
 } catch (error) {
    console.log(error)
  }
};

export const deleteUser = async (req:Request,res:Response)=>{
  try {
    const {id} =req.params;
    const user = await prisma.user.delete({
      where:{
        id:id
      }
    })
    if(!user){
      res.status(HttpCode.NOT_FOUND).send({msg:"user not found"})
    }else{
      res.status(HttpCode.OK).send({msg:"user delete"})
    }
  } catch (error) {
    console.log(error)
    res.status(HttpCode.INTERNAL_SERVER_ERROR).send({msg:"erreur au niveau du server"})
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword }
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const modify = await prisma.user.create({
      where:{
        id:parseInt(id)
      },
      data: { email, password: hashedPassword }
    });
     if(!modify){
      res.status(HttpCode.NOT_FOUND).send({msg:"user not found"})
     }else{
      res.status(HttpCode.OK).send({msg:"user modify successfully"})
     }
  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ message: "Error modify user" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign({ id: user.id }, accessTokenSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, refreshTokenSecret, { expiresIn: '7d' });

    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // Expire dans 15 minutes

    await prisma.user.update({
      where: { email },
      data: { otp, otpExpiry }
    });

    await sendOtpEmail(email, otp);
    res.status(200).json({ message: "OTP sent" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP" });
  }
};


export const verifyOtpHandler = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('otpForm', { message: errors.array()[0].msg });
    }
    
    if (isDateBeforeNow(user.otpExpiry)) {
      return res.render('otpForm', { message: "Le code OTP a expiré" });
    }
    const isValidOtp = verifyOtp(otp, process.env.OTP_SECRET || 'default_secret');

    if (!isValidOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP est valide, effectuer des actions supplémentaires (ex. : réinitialiser le mot de passe)
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP" });
  }
};