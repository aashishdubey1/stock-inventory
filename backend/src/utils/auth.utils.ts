import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import serverConfig from "../config/serverConfig";

export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, serverConfig.JWT_SALT_ROUNDS);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, serverConfig.JWT_SECRET, { expiresIn: serverConfig.JWT_EXPIRES_IN as any });
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, serverConfig.JWT_SECRET);
};
