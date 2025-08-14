import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { transactions } from "@/database/schema";
import { eq, and, desc, asc } from "drizzle-orm";

type TxStatus = "PENDING" | "APPROVED" | "REJECTED" | "FAILED";

function isTxStatus(val: string): val is TxStatus {
  return ["PENDING", "APPROVED", "REJECTED", "FAILED"].includes(val);
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const token = searchParams.get("token");
  const sort = searchParams.get("sort") || "desc";

  let whereClause = eq(transactions.userId, session.user.id);
  if (status && isTxStatus(status)) {
    whereClause = and(whereClause, eq(transactions.status, status))!;
  }
  if (token && token !== "ALL") {
    whereClause = and(whereClause, eq(transactions.token, token))!;
  }

  const result = await db
    .select()
    .from(transactions)
    .where(whereClause)
    .orderBy(sort === "desc" ? desc(transactions.createdAt) : asc(transactions.createdAt));

  return new Response(JSON.stringify({ transactions: result }));
}
