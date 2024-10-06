import speakeasy from 'speakeasy';

export const generateOtp = () => {
  return speakeasy.totp({
    secret: process.env.OTP_SECRET || 'default_secret', // Utilise une clé secrète
    encoding: 'base32',
    step: 300 // L'OTP sera valide pendant 5 minutes (300 secondes)
  });
};

export const verifyOtp = (otp: string, userSecret: string) => {
    return speakeasy.totp.verify({
      secret: userSecret,
      encoding: 'base32',
      token: otp,
      window: 1 // Tolère une petite différence de temps (1 étape en plus ou en moins)
    });
  };