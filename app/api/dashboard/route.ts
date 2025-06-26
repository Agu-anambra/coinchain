// app/api/dashboard/route.ts

import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const user = await db
    .select({
      fullName: users.fullName,
      usdt: users.usdtBalance,
      btc: users.btcBalance,
      eth: users.ethBalance,
      bnb: users.bnbBalance,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .then(res => res[0]);

  return Response.json(user);
}
