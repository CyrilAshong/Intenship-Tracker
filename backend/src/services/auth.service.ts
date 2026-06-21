import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { prisma } from '../config/db';
import { signToken } from '../utils/jwt';

interface RegisterInput {
  email: string;
  password: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

export const registerUser = async (input: RegisterInput) => {
  const { password, role, firstName, lastName, companyName } = input;
  const email = input.email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
      isVerified: true,
      otp: null,
      otpExpiry: null,
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

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return { user, token };
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