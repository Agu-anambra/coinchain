import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { transactions } from "@/database/schema";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return new Response("Unauthorized", { status: 401 });

  const { token, amount } = await req.json();

  if (!token || !amount) {
    return new Response("Invalid input", { status: 400 });
  }

  await db.insert(transactions).values({
    userId: session.user.id,
    token,
    amount,
    type: "WITHDRAW",
    status: "PENDING",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return new Response("OK");
}
