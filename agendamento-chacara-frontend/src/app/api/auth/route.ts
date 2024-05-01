import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const token = jwt.sign({ id: body.id }, process.env.JWT_PASS ?? "", {
    expiresIn: "24h",
  });
  console.log("sds");
  return Response.json({ token });
}
