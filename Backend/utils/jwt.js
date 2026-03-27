import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const sendTokenAsCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    // secure true in production with https
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // match JWT_EXPIRES_IN
    domain: process.env.COOKIE_DOMAIN || undefined,
  };
  res.cookie("token", token, cookieOptions);
};
