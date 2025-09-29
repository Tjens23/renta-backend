import { compare, genSalt, hash } from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  if (!password) {
    throw new Error('Password is required');
  }
  const saltRounds = 10;
  const salt = await genSalt(saltRounds);
  return await hash(password, salt);
};

export const comparePasswords = async (
  userPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await compare(userPassword, hashedPassword);
};
