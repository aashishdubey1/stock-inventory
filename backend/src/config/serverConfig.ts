import dotenv from "dotenv";
dotenv.config();

export default {
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET || "supersecret",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
    JWT_SALT_ROUNDS: parseInt(process.env.JWT_SALT_ROUNDS || "10", 10),
}