import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { prisma } from '../config/db';
import { signToken } from '../utils/jwt';
import { sendOTPEmail } from './email.service';

interface RegisterInput {
  email: string;
  password: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const logOTPInDevelopment = (email: string, otp: string) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DEV OTP] ${email}: ${otp}`);
  }
};

export const registerUser = async (input: RegisterInput) => {
  const { password, role, firstName, lastName, companyName } = input;
  const email = input.email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (!existing.isVerified && existing.role === role) {
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      const user = await prisma.user.update({
        where: { email },
        data: { otp, otpExpiry },
        include: {
          studentProfile: true,
          companyProfile: true,
        },
      });

      await sendOTPEmail(email, otp);
      logOTPInDevelopment(email, otp);

      return { user };
    }

    throw new Error('An account with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
      otp,
      otpExpiry,
      isVerified: false,
      ...(role === Role.STUDENT && {
        studentProfile: {
          create: {
            firstName: firstName ?? '',
            lastName: lastName ?? '',
          },
        },
      }),
      ...(role === Role.COMPANY && {
        companyProfile: {
          create: {
            companyName: companyName ?? '',
          },
        },
      }),
    },
    include: {
      studentProfile: true,
      companyProfile: true,
    },
  });

  // Send OTP email
  await sendOTPEmail(email, otp);
  logOTPInDevelopment(email, otp);

  return { user };
};

export const verifyOTP = async (email: string, otp: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedOTP = otp.trim();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: {
      studentProfile: true,
      companyProfile: true,
    },
  });

  if (!user) throw new Error('User not found.');
  if (user.isVerified) throw new Error('Account already verified.');
  if (!user.otp || !user.otpExpiry) throw new Error('No OTP found. Please register again.');
  if (user.otp !== normalizedOTP) throw new Error('Invalid OTP code.');
  if (new Date() > user.otpExpiry) throw new Error('OTP has expired. Please register again.');

  const updatedUser = await prisma.user.update({
    where: { email: normalizedEmail },
    data: {
      isVerified: true,
      otp: null,
      otpExpiry: null,
    },
    include: {
      studentProfile: true,
      companyProfile: true,
    },
  });

  const token = signToken({
    userId: updatedUser.id,
    email: updatedUser.email,
    role: updatedUser.role,
  });

  return { user: updatedUser, token };
};

export const loginUser = async (email: string, password: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: {
      studentProfile: true,
      companyProfile: true,
    },
  });

  if (!user) throw new Error('Invalid email or password.');
  if (!user.isActive) throw new Error('Your account has been deactivated.');
  if (!user.isVerified) throw new Error('Please verify your email before logging in.');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Invalid email or password.');

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return { user, token };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      studentProfile: true,
      companyProfile: true,
    },
  });

  if (!user) throw new Error('User not found.');
  return user;
};

export const resendOTP = async (email: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) throw new Error('User not found.');
  if (user.isVerified) throw new Error('Account already verified.');

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { email: normalizedEmail },
    data: { otp, otpExpiry },
  });   

  await sendOTPEmail(normalizedEmail, otp);
  logOTPInDevelopment(normalizedEmail, otp);
  return { message: 'OTP resent successfully.' };
};
