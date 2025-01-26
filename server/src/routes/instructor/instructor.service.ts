import { InstructorDTO } from './instructor.dto';
import { Instructor } from './instructor.schema';
import { generateTokens } from '../../utils/tokenHelper';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
/**
 * Onboards a new instructor by checking if the instructor exists,
 * creating a new instructor, generating access and refresh tokens,
 * and saving the instructor with tokens.
 * 
 * @param {InstructorDTO} instructorData - The data to create a new instructor.
 * @returns {Promise<Object>} - The onboarded instructor details along with generated tokens.
 * @throws {Error} - If the instructor already exists.
 */
export const onboardInstructorService = async (instructorData: InstructorDTO) => {
  const existingInstructor = await Instructor.findOne({ email: instructorData.email });
  if (existingInstructor) {
    throw new Error('Instructor with this email already exists');
  }

  const newInstructor = new Instructor({
    name: instructorData.name,
    email: instructorData.email,
    password: instructorData.password,
    role: 'instructor',
    qualifications: instructorData.qualifications,
    experience: instructorData.experience,
  });

  await newInstructor.save();

  const tokens = generateTokens((newInstructor._id as unknown as string).toString());

  newInstructor.accessToken = tokens.accessToken;
  newInstructor.refreshToken = tokens.refreshToken;

  await newInstructor.save();

  return {
    id: newInstructor._id,
    name: newInstructor.name,
    email: newInstructor.email,
    role: newInstructor.role,
    qualifications: newInstructor.qualifications,
    experience: newInstructor.experience,
    accessToken: newInstructor.accessToken,
    refreshToken: newInstructor.refreshToken,
  };
};




export const loginService = async (loginData: InstructorDTO) => {

    const user = await Instructor.findOne({ email: loginData.email });
    if (!user) {
      throw new Error('NO SUCH USER EXIST');
    }
  
    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(loginData.password, user.password);
    
    if (!isMatch) {
      throw new Error ('Invalid credentials');
    }
  
    
  const tokens = generateTokens((user._id as unknown as string).toString());

  user.accessToken = tokens.accessToken;
  user.refreshToken = tokens.refreshToken;

  await user.save();

  
    return {
      name:user.name,
      email:user.email,
      accessToken: user.accessToken,
      refreshToken:user.refreshToken
      
    };
  };



  export const logoutService = async (accessToken: string): Promise<void> => {
    // Verify the refresh token
    try {
      const decoded: any = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string);
      const userId = decoded.userId;
  
  
      const user=await Instructor.findById(userId);
  
  
  
      if (!user) {
        throw new Error("No such user found")
      }
      user.refreshToken = "";
      user.save();
  
  
      return ;
    
    
    }
  
  
  catch(error){
    throw new Error("Some Error occured in the logout")
  }}
  