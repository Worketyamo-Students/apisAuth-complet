import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, requestPasswordReset } from '../controllers/authController';
import {  verifyOtpHandler } from '../controllers/authController';
import { verifyOtp } from '../services/optService';
const router = Router();

router.get('/otp', (req: Request, res: Response) => {
    res.render('otpForm', { message: null });
  });
router.post('/request-password-reset', [body('email').isEmail()], requestPasswordReset);
router.post('/verify-otp', [body('email').isEmail(), body('otp').notEmpty()], verifyOtpHandler);
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 6 }).withMessage('Mot de passe trop court')
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email invalide'),
    body('password').notEmpty().withMessage('Mot de passe requis')
  ],
  login
);

router.post(
  '/request-password-reset',
  [body('email').isEmail().withMessage('Email invalide')],
  requestPasswordReset
);
router.post('/verify-otp', [
    body('email').isEmail(),
    body('otp').notEmpty().isLength({ min: 6, max: 6 })
  ], verifyOtpHandler);
router.post(
  '/verify-otp',
  [body('otp').notEmpty().withMessage('OTP requis')],
  verifyOtp
);

export { router as authRoutes };