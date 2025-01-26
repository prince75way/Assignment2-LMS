import mongoose, { Document } from 'mongoose';
import { BaseSchema } from '../../common/dto/base.dto';

export interface UserDTO extends BaseSchema {
  name: string;
  email: string;
  password: string;
  role: 'student';
  refreshToken?: string | null;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
