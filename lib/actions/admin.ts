"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";



export async function updateUserRole(userId: string, newRole: "ADMIN" | "USER") {
  await db.update(users).set({ role: newRole }).where(eq(users.id, userId));
}

// export async function updateUserBalance(userId: string, balances: Record<string, string>) {
//   await db.update(users).set({
//     usdtBalance: balances.usdt,
//     btcBalance: balances.btc,
//     ethBalance: balances.eth,
//     bnbBalance: balances.bnb,
//   }).where(eq(users.id, userId));
// }

export async function updateUserBalance(
    userId: string,
    balances: {
        usdt: string;
        btc: string;
        eth: string;
        bnb: string;
        dot: string;
        sol: string;
        doge: string;
        trx: string;
        xrp: string;
        usdc: string;
        ltc: string;
        matic: string;
    }
) {
  const toFixedString = (val: string) =>
    isNaN(Number(val)) ? "0.00" : Number(val).toFixed(8);
    const result = await db
    .update(users)
    .set({
        usdtBalance: toFixedString(balances.usdt),
        btcBalance: toFixedString(balances.btc),
        ethBalance: toFixedString(balances.eth),
        bnbBalance: toFixedString(balances.bnb),
        dotBalance: toFixedString(balances.dot),
        solBalance: toFixedString(balances.sol),
        dogeBalance: toFixedString(balances.doge),
        trxBalance: toFixedString(balances.trx),
        xrpBalance: toFixedString(balances.xrp),
        usdcBalance: toFixedString(balances.usdc),
        ltcBalance: toFixedString(balances.ltc),
        maticBalance: toFixedString(balances.matic),
    })
    .where(eq(users.id, userId))
    .returning();

    // console.log("Updated rows:", result);
}

export async function deleteUser(userId: string) {
  return db.delete(users).where(eq(users.id, userId));
}
