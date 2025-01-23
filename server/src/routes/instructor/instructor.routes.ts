import { instructorLoginValidation, onboardInstructorValidation } from './instructor.validation';
import express from 'express';
import { loginController, onboardInstructorController } from './instructor.controller';
import { validateRequest } from '../../common/middlewares/validation.middleware'
const router = express.Router();


router.post('/onboard', onboardInstructorValidation, validateRequest, onboardInstructorController);

router.post('/login',instructorLoginValidation,validateRequest,loginController)

export default router;
