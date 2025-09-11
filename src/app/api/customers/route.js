// src/app/api/customers/route.js
import { NextResponse } from "next/server";
import { invoices } from "@/api/invoices";

export async function GET() {
  return NextResponse.json(invoices);
}
