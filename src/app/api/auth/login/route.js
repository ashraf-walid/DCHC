// src/app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { users } from "@/api/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  console.log('\n🔑 [login/route.js] Starting login process');
  
  try {
    const requestData = await req.json();
    const { username, password } = requestData;
    
    const user = users.find((u) => u.username === username);
    if (!user) {
      console.log('User not found:', username);
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      console.log('Invalid password for user:', username);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create token payload
    const payload = { 
      username: user.username, 
      debitCode: user.debitCode,
      timestamp: new Date().toISOString()
    };
    
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    
    console.log('✅ JWT Token created successfully');
    console.log('Token length:', token.length);
    
    // Verify the token immediately to ensure it's valid
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('🔍 Successfully verified JWT token after creation:', {
        username: decoded.username,
        debitCode: decoded.debitCode,
        debitCodeType: typeof decoded.debitCode,
        debitCodeLength: decoded.debitCode?.length,
        iat: new Date(decoded.iat * 1000).toISOString(),
        exp: new Date(decoded.exp * 1000).toISOString()
      });
    } catch (verifyError) {
      console.error('❌ Failed to verify JWT token after creation:', {message: verifyError.message});
    }
    
    console.log('✅ JWT Token created successfully');
    
    const res = NextResponse.json({ success: true });
    res.cookies.set("auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 60 * 60,
    });

    console.log('Auth cookie set successfully');
    return res;
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}