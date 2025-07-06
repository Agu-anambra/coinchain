import { db } from "@/database/drizzle";
import { wallets } from "@/database/schema";
import { eq } from "drizzle-orm";

// GET: Return all wallet rows
export async function GET() {
  const result = await db.select().from(wallets);
  return Response.json(result);
}

// POST: Upsert addresses
export async function POST(req: Request) {
  const data = await req.json(); // expects { USDT: "0x123", BTC: "..." }

  const tokens = Object.keys(data);
  const values = tokens.map((token) => ({
    token,
    address: data[token],
  }));

  for (const { token, address } of values) {
    const [existing] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.token, token));

    if (existing) {
      await db
        .update(wallets)
        .set({ address })
        .where(eq(wallets.token, token));
    } else {
      await db.insert(wallets).values({ token, address });
    }
  }

  return new Response("OK");
}
