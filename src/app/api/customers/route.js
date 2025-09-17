// src/app/api/customers/route.js
import { NextResponse } from "next/server";
import { invoices } from "@/api/invoices"; // your imported test data
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req) {
  try {
    const user = getUserFromRequest(req);
    const userDebit = user.debitCode;

    const filtered = invoices.filter((inv) => inv['Debit Code'] === userDebit);

    return NextResponse.json(filtered);
  } catch (err) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
