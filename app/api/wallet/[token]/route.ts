import { db } from "@/database/drizzle";
import { wallets } from "@/database/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// export async function GET(
//     req: Request,
//     context: { params: { token: string } }
// ) {
//     const params = await context.params
//     const token = await params.token
//     // const token = await context.params.token;
//     const result = await db.select()
//     .from(wallets)
//     .where(eq(wallets.token, token.toUpperCase()))
//     .limit(1);
//     if (!result.length) return new Response("Not found", { status: 404 });
//     return Response.json(result[0]);
// }

export async function GET(req: Request, context: { params: { token: string } }) {
  const params = await context.params;
  const tokenParam = await params.token.toUpperCase();
  // const token = await context.params.token;

const [token, network] = tokenParam.split('-');
  const result = await db
    .select()
    .from(wallets)
    // .where(eq(wallets.token, token));
    .where(and(eq(wallets.token, token), eq(wallets.network, network))); 

  if (!result.length) return new Response("Not found", { status: 404 });

  // return Response.json(result); // ✅ Return all networks for this token
  return NextResponse.json({ address: result[0] });
}
