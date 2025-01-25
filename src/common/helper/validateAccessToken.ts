import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Middleware to validate access token
export const validateAccessToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.body.accessToken;

  if (!token) {
    res.status(401).json({ message: 'Access token is required' });
    return; // Ensure the response ends here
  }

  try {
    // Verify the access token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);

    console.log('Token is valid and not expired.');
    next(); // Proceed to the next middleware or route handler
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Access token expired', error: 'token_expired' });
      return; // Ensure the response ends here
    }
    res.status(403).json({ message: 'Invalid token' });
  }
};
