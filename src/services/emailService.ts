import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Ton adresse email
    pass: process.env.EMAIL_PASS  // Mot de passe ou token d'application
  }
});

export const sendOtpEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Votre code OTP',
    text: `Voici votre code OTP: ${otp}. Il expire dans 15 minutes.`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP envoyé à ${email}`);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw new Error('Erreur lors de l\'envoi de l\'OTP');
  }
};