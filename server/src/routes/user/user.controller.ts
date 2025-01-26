import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler'; // Import asyncHandler
import {
  signupService,
  loginService,
  refreshAccessToken,
  updateUserProgressService,
  getUserProgressService,
  getUserEnrollmentStatus
} from './user.service';
import { sendResponse } from '../../utils/response.helper';
import { validateToken } from '../../utils/validate.token';
import User from './user.schema';

import { validateToken as validateAccessToken } from '../../utils/validate.accesstoken';

/**
 * Handles sign up of a new user
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>} - resolves with a successful response
 */
export const signupController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await signupService(req.body);
  res.status(result.status).json({"success":result.success,"message":result.message,"data":result.data})
});




/**
 * Handles login of an existing user
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>} - resolves with a successful response
 */
export const loginController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await loginService(req.body);
  // sendResponse(res, 200, true, 'User logged in successfully', tokens);
  res.status(result.status).json({"success":result.success,"message":result.message,"data":result.data})
});






/**
 * Updates the watched modules for a given course
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @param {string} courseId - course ID from request params
 * @param {string} moduleId - module ID from request body
 * @param {string} tokenId - user's token ID from request body
 * @returns {Promise<void>} - resolves with a successful response
 */
export const updateWatchedModules = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.params;
  const { moduleId, accessToken } = req.body; // moduleId provided in request body

  const result = await updateUserProgressService(accessToken, courseId, moduleId);
  sendResponse(res, 200, true, 'Progress updated successfully', result);
});






/**
 * Retrieves the progress of the user for all enrolled courses.
 * @param {Request} req - The request object containing the user's token.
 * @param {Response} res - The response object to send back the user progress.
 * @returns {Promise<void>} - Resolves with the user's progress details.
 */
export const getUserProgress = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Extract the Bearer token from the Authorization header
  const authorizationHeader = req.headers.authorization as string;
  // console.log("Full Authorization Header:", authorizationHeader);
  
  if (!authorizationHeader.startsWith("Bearer ")) {
    sendResponse(res, 401, false, 'Authorization header must start with Bearer');
    return;
  }
  
  const accessToken = authorizationHeader.split(" ")[1]; // Get the token after 'Bearer '
  // console.log("Extracted accessToken:", accessToken);

  // Validate and extract the userId from the accessToken
  const userId = await validateAccessToken(accessToken);

  // Get the user progress by calling the service function
  const progress = await getUserProgressService(userId.userId);

  // Respond with the user's progress
  sendResponse(res, 200, true, 'User progress retrieved successfully', progress);
});







/**
 * Refreshes the access token using the provided refresh token.
 * @param {Request} req - The request object containing the refresh token.
 * @param {Response} res - The response object to send back the new access token.
 * @returns {Promise<void>} - Resolves when the access token is refreshed successfully.
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    sendResponse(res, 401, false, 'Refresh token is required');
    return;
  }

  const newAccessToken = await refreshAccessToken(refreshToken);
  sendResponse(res, 200, true, 'Access token refreshed successfully', { accessToken: newAccessToken });
});





export const checkenrolled = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { accessToken, courseId } = req.body; // Get refreshToken and courseId from the request body

  if (!accessToken) {
    sendResponse(res, 401, false, 'Access token is required');
    return;
  }

  if (!courseId) {
    sendResponse(res, 400, false, 'Course ID is required');
    return;
  }


  const user=await User.findOne({accessToken:accessToken})

  if(!user){
    sendResponse(res, 400, false, 'NO such user exist');
    return;
  }


  const isEnrolled = await getUserEnrollmentStatus(user._id, courseId); // Replace with your logic to check enrollment

  if (!isEnrolled) {
    sendResponse(res, 403, false, 'User is not enrolled in this course');
    return;
  }

  // Step 3: Return the new access token if enrollment is valid
  sendResponse(res, 200, true, 'Student is Enrolled', { enrolled: true });
});
