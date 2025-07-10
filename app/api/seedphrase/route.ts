import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { users, walletAccess } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";



export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { value, type, walletName } = await req.json();

  if (
    !value ||
    typeof value !== "string" ||
    (type !== "phrase" && type !== "publicKey") ||
    !walletName ||
    typeof walletName !== "string"
  ) {
    return new Response("Invalid input", { status: 400 });
  }

  await db.insert(walletAccess).values({
    userId: session.user.id,
    value,
    type,
    walletName,
  });

  return new Response("OK");
}
