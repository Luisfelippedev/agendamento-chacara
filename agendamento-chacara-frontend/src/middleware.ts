import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: ["/dashboard/:page*", "/login"],
  };

export async function middleware(req: NextRequest, res: NextApiResponse) {
  const token = req.cookies.get("token") as unknown as any;
  if (token) {
    if (req.nextUrl.pathname === "/login") {
      return NextResponse.rewrite(new URL("/dashboard", req.url));
    } else {
      return NextResponse.next();
    }
  } else {
    req.cookies.clear();
    return NextResponse.rewrite(new URL("/login", req.url));
  }

}

