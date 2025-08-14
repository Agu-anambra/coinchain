import { db } from "@/database/drizzle";
import { transactions, users } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { txId, action, note } = await req.json();

  // 1. Fetch transaction
  const [tx] = await db.select().from(transactions).where(eq(transactions.id, txId));
  if (!tx) return new Response("Transaction not found", { status: 404 });

  if (action === "APPROVE") {
    // 2. Extract coin balance key (e.g., btcBalance)
    const [coin] = tx.token.split("-");
    const balanceKey = `${coin.toLowerCase()}Balance` as keyof typeof users.$inferInsert;

    // 3. Fetch latest user balance
    const [user] = await db.select().from(users).where(eq(users.id, tx.userId));
    if (!user) return new Response("User not found", { status: 404 });

    // const currentBalance = parseFloat(user[balanceKey] ?? "0");
    const currentBalance = parseFloat(String(user[balanceKey] ?? "0"));
    const withdrawalAmount = parseFloat(tx.amount);

    // 4. Check if balance is enough
    if (currentBalance < withdrawalAmount) {
      // Mark as FAILED due to insufficient balance
      await db.update(transactions)
        .set({
          status: "FAILED",
          note: "Insufficient balance at approval time",
          updatedAt: new Date(),
        })
        .where(eq(transactions.id, txId));

      return new Response("Insufficient balance", { status: 400 });
    }

    // 5. Deduct balance
    const newBalance = currentBalance - withdrawalAmount;
    await db.update(users)
      .set({ [balanceKey]: newBalance.toFixed(8) })
      .where(eq(users.id, tx.userId));

    // 6. Mark as APPROVED
    await db.update(transactions)
      .set({ status: "APPROVED", updatedAt: new Date() })
      .where(eq(transactions.id, txId));

  } else if (action === "REJECT") {
    // REJECT logic unchanged
    await db.update(transactions)
      .set({
        status: "REJECTED",
        note: note ?? "No reason given",
        updatedAt: new Date(),
      })
      .where(eq(transactions.id, txId));
  }

  return new Response("OK");
}
