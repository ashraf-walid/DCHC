// src/lib/auth.js
import jwt from "jsonwebtoken";

export function getUserFromRequest(req) {
  const token = req.cookies.get("auth")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch {
    return null;
  }
}
