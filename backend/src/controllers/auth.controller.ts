import { Request, Response } from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  verifyOTP,
  resendOTP,
} from '../services/auth.service';
import { sendSuccess, sendCreated, sendError } from '../utils/responseHelper';
import { Role } from '@prisma/client';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role, firstName, lastName, companyName } = req.body;

    if (!email || !password || !role) {
      sendError(res, 'Email, password and role are required.', 400);
      return;
    }

    if (!Object.values(Role).includes(role)) {
      sendError(res, 'Role must be STUDENT or COMPANY.', 400);
      return;
    }

    if (password.length < 6) {
      sendError(res, 'Password must be at least 6 characters.', 400);
      return;
    }

    const { user } = await registerUser({
      email,
      password,
      role,
      firstName,
      lastName,
      companyName,
    });

    sendCreated(res, {
      email: user.email,
      role: user.role,
    }, 'Registration successful. Please check your email for the OTP verification code.');

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed.';
    sendError(res, message, 400);
  }
};

export const verify = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      sendError(res, 'Email and OTP are required.', 400);
      return;
    }

    const { user, token } = await verifyOTP(email, otp);

    sendSuccess(res, {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        studentProfile: user.studentProfile,
        companyProfile: user.companyProfile,
      },
    }, 'Email verified successfully. Welcome to UniIntern!');

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Verification failed.';
    sendError(res, message, 400);
  }
};

export const resendOTPHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      sendError(res, 'Email is required.', 400);
      return;
    }
    const result = await resendOTP(email);
    sendSuccess(res, result, 'OTP resent successfully.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to resend OTP.';
    sendError(res, message, 400);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      sendError(res, 'Email and password are required.', 400);
      return;
    }

    const { user, token } = await loginUser(email, password);

    sendSuccess(res, {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        studentProfile: user.studentProfile,
        companyProfile: user.companyProfile,
      },
    }, 'Login successful.');

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed.';
    sendError(res, message, 401);
  }
};

export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await getMe(req.user!.userId);

    sendSuccess(res, {
      id: user.id,
      email: user.email,
      role: user.role,
      studentProfile: user.studentProfile,
      companyProfile: user.companyProfile,
    }, 'User fetched successfully.');

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not fetch user.';
    sendError(res, message, 404);
  }
};