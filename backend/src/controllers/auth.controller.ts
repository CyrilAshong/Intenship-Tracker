import { Request, Response } from 'express';
import { registerUser, loginUser, getMe } from '../services/auth.service';
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

    const { user, token } = await registerUser({
      email,
      password,
      role,
      firstName,
      lastName,
      companyName,
    });

    sendCreated(res, {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        studentProfile: user.studentProfile,
        companyProfile: user.companyProfile,
      },
    }, 'Registration successful.');

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed.';
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