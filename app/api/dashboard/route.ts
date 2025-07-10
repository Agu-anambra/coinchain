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
      dotBalance: users.dotBalance,
      solBalance: users.solBalance,
      dogeBalance: users.dogeBalance,
      trxBalance: users.trxBalance,
      xrpBalance: users.xrpBalance,
      usdcBalance: users.usdcBalance,
      ltcBalance: users.ltcBalance,
      maticBalance: users.maticBalance,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .then(res => res[0]);

  return Response.json(user);
}
