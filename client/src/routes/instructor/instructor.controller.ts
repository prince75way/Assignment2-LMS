
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler'; // Import asyncHandler
import { onboardInstructorService,loginService,logoutService } from './instructor.service';
import { sendResponse } from '../../utils/response.helper';

/**
 * Controller to onboard an instructor.
 * 
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>}
 */
export const onboardInstructorController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const instructor = await onboardInstructorService(req.body);
  sendResponse(res, 201, true, 'Instructor onboarded successfully', instructor);
});


export const loginController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const tokens = await loginService(req.body);
  sendResponse(res, 200, true, 'User logged in successfully', tokens);
});


export const logoutController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const tokens = await logoutService(req.body);
  sendResponse(res, 200, true, 'User Logout out successfully');
});
