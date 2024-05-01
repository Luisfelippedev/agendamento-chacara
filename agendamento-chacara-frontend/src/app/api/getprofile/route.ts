import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { UserRepository } from "@/repositories/UserRespository";

type IPayLoad = {
  id: string;
};

export async function POST(req: NextRequest) {
  const userRepository = new UserRepository();

  const body = await req.json();

  const token = body.token;

  try {
    const { id } = jwt.verify(token, process.env.JWT_PASS ?? "") as IPayLoad;

    if (!id) {
      throw new Error("Unauthenticated user");
    }

    const userExists = await userRepository.findById(id);

    if (!userExists) {
      throw new Error("Unauthenticated user");
    }

    return Response.json({ userExists });
  } catch (error) {
    throw new Error("Invalid token");
  }
}
