import { NextRequest, NextResponse } from "next/server";
import { UserService } from "./services/UserService";

export const config = {
  matcher: ["/dashboard/:page*", "/login"],
};

export async function middleware(req: NextRequest) {
  const userService = new UserService(); // Error nesta linha
  const token = req.cookies.get("token") as unknown as any;

  if (token) {
    try {
      const userExists = await userService.getProfile(token.value);

      if (userExists) {
        if (req.nextUrl.pathname === "/login") {
          return NextResponse.rewrite(new URL("/dashboard", req.url));
        } else {
          return NextResponse.next();
        }
      }
    } catch (error) {
      req.cookies.clear();
      return NextResponse.rewrite(new URL("/login", req.url));
    }
  } else {
    req.cookies.clear();
    return NextResponse.rewrite(new URL("/login", req.url));
  }
}
