import { db } from "@/database/drizzle";
import { wallets } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET(
    req: Request,
    context: { params: { token: string } }
) {
    //   const { token } = params;
    const token = context.params.token;
    const result = await db.select()
    .from(wallets)
    .where(eq(wallets.token, token.toUpperCase()))
    .limit(1);
    if (!result.length) return new Response("Not found", { status: 404 });
    return Response.json(result[0]);
}
