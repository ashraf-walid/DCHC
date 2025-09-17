// src/app/api/auth/refresh/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { users } from "@/api/users";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth")?.value;
  
  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = users.find(u => u.username === decoded.username);
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const newToken = jwt.sign(
      { username: user.username, debitCode: user.debitCode },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const response = NextResponse.json({ success: true });
    response.cookies.set("auth", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 60 * 60,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired token" }, 
      { status: 401 }
    );
  }
}
