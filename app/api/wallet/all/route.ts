import { db } from "@/database/drizzle";
import { wallets } from "@/database/schema";
import { and, eq } from "drizzle-orm";

// GET: Return all wallet rows
export async function GET() {
  const result = await db.select().from(wallets);
  return Response.json(result);
}


export async function POST(req: Request) {
  const data = await req.json(); // expects { USDT: { ERC20: "0x123", ... }, BTC: { MAINNET: "..." } }
  
  for (const token of Object.keys(data)) {
    const networks = data[token];
    
    for (const network of Object.keys(networks)) {
      const address = networks[network];

      const [existing] = await db
      .select()
        .from(wallets)
        .where(and(eq(wallets.token, token), eq(wallets.network, network)));

      if (existing) {
        await db
          .update(wallets)
          .set({ address })
          .where(and(eq(wallets.token, token), eq(wallets.network, network))); 
        } else {
          await db.insert(wallets).values({ token, network, address });
      }
    }
  }

  return new Response("OK");
}

// POST: Upsert addresses
// export async function POST(req: Request) {
//   const data = await req.json(); // expects { USDT: { ERC20: "0x123", ... }, BTC: { MAINNET: "..." } }

//   const tokens = Object.keys(data);
//   const values = tokens.map((token) => ({
//     token,
//     address: data[token],
//   }));

//   for (const { token, address } of values) {
//     const [existing] = await db
//       .select()
//       .from(wallets)
//       .where(eq(wallets.token, token));

//     if (existing) {
//       await db
//         .update(wallets)
//         .set({ address })
//         .where(eq(wallets.token, token));
//     } else {
//       await db.insert(wallets).values({ token, address });
//     }
//   }

//   return new Response("OK");
// }