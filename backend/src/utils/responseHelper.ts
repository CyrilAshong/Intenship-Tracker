import { Response } from 'express';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 400,
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export const sendCreated = <T>(
  res: Response,
  data: T,
  message = 'Resource created successfully',
): Response => {
  return sendSuccess(res, data, message, 201);
};