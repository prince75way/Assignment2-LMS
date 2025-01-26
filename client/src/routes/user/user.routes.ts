import { validateRequest } from './../../common/middlewares/validation.middleware';
import express, { RequestHandler } from 'express';
import * as validation from './user.validation';
import * as controller from './user.controller';
import { validateAccessToken } from '../../common/helper/validateAccessToken';

const router = express.Router();

// Apply validation middleware to the signup route
router.post('/signup', validation.userSignupValidation, validateRequest, controller.signupController);

// Apply validation middleware to the login route
router.post('/login', validation.userLoginValidation, validateRequest, controller.loginController);

// Route to update watched modules
// This route requires a valid accessToken, so use validateAccessToken here
router.post('/watchedmodule/:courseId', validateAccessToken, validation.validateUpdateWatchedModules, validateRequest, controller.updateWatchedModules);

// Route to get user progress, which also requires token validation
router.get('/progress', validateAccessToken, controller.getUserProgress);

// Route to refresh tokens
// No need for validateAccessToken here, since this is the endpoint for refreshing tokens
router.post('/refresh-token', validation.validateRefreshAccessToken, controller.refreshAcessToken as unknown as RequestHandler);

// Check if the user is enrolled in a course (no token required here)
router.post('/check-enrollment',validateAccessToken, controller.checkenrolled);

// Logout route
// No need for validateAccessToken here, since this is for logging out the user
router.post('/logout', validation.logout, controller.logout);

export default router;
