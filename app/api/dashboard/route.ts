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
      usdtBalance: users.usdtBalance,
      btcBalance: users.btcBalance,
      ethBalance: users.ethBalance,
      bnbBalance: users.bnbBalance,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .then(res => res[0]);

  return Response.json(user);
}
