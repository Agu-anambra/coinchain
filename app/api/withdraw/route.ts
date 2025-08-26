import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { transactions, users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { getNativeFromTokenNetwork } from "@/lib/utils";


export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return await recordFailure(null, "Unauthorized", 401);
    }
const b = await req.json();
const [token, network] = b.token.split("-");
const amount = Number(b.amount); // ✅ force number
const withdrawalWallet = b.withdrawalWallet;

    // const { token, network, amount, withdrawalWallet } = await req.json();
    if (!token || !network || !amount || !withdrawalWallet) {
      return await recordFailure(session.user.id, "Invalid input", 400, { token, amount, withdrawalWallet });
    }

    const native = getNativeFromTokenNetwork(token, network);
    if (!native) {
      return await recordFailure(session.user.id, "Unsupported token/network", 400, { token, amount, withdrawalWallet });
    }

    const [user] = await db.select().from(users).where(eq(users.id, session.user.id));
    if (!user) {
      return await recordFailure(session.user.id, "User not found", 404, { token, amount, withdrawalWallet });
    }

    const tokenBalance = parseFloat((user as Record<string, string | null>)[`${token.toLowerCase()}Balance`] ?? "0");
    const nativeBalance = parseFloat((user as Record<string, string | null>)[`${native.toLowerCase()}Balance`] ?? "0");
    
    if (tokenBalance < amount) {
      return await recordFailure(session.user.id, `Insufficient ${token} balance`, 400, { token, amount, withdrawalWallet });
    }

    // const gasFee = amount * 0.01;
    if (nativeBalance === 0) {
      return await recordFailure(session.user.id, `Insufficient ${native} gas fee`, 400, { token, amount, withdrawalWallet });
    }

    // ✅ Passed all checks — mark PENDING
    await db.insert(transactions).values({
      userId: session.user.id,
      token: `${token}-${network}`,
      amount:amount.toString(),
      type: "WITHDRAW",
      withdrawalWallet,
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    return new Response(JSON.stringify({ success: true }), { status: 200 });
    
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: "Server error" }), { status: 500 });
  }
}

async function recordFailure(userId: string | null, reason: string, statusCode: number, data: any = {}) {
  if (userId) {
    await db.insert(transactions).values({
      userId,
      token: data.token || null,
      amount: data.amount || 0,
      type: "WITHDRAW",
      withdrawalWallet: data.withdrawalWallet || null,
      status: "FAILED",
      note: reason,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  return new Response(JSON.stringify({ success: false, error: reason }), { status: statusCode });
}
  
  // export async function POST(req: NextRequest) {
  //   try {
  //     // 1️⃣ Auth check
  //     const session = await auth();
  //     if (!session?.user?.id) {
  //       return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 });
  //     }
  
  //     // 2️⃣ Extract input
  //     const { token, network, amount, withdrawalWallet } = await req.json();
  //     if (!token || !network || !amount || !withdrawalWallet) {
  //       return new Response(JSON.stringify({ success: false, error: "Invalid input" }), { status: 400 });
  //     }
  
  //     // 3️⃣ Get native token for network
  //     const native = getNativeFromTokenNetwork(token, network);
  //     if (!native) {
  //       return new Response(JSON.stringify({ success: false, error: "Unsupported token/network" }), { status: 400 });
  //     }
  
  //     // 4️⃣ Fetch user balances
  //     const [user] = await db.select().from(users).where(eq(users.id, session.user.id));
  //     if (!user) {
  //       return new Response(JSON.stringify({ success: false, error: "User not found" }), { status: 404 });
  //     }
  
  //     // const tokenBalance = (user as Record<string, string | null>)[`${token.toLowerCase()}Balance`] || 0;
  //     // const nativeBalance = (user as Record<string, string | null>)[`${native.toLowerCase()}Balance`] || 0;
  
  //     const tokenBalance = parseFloat((user as Record<string, string | null>)[`${token.toLowerCase()}Balance`] ?? "0");
  //     const nativeBalance = parseFloat((user as Record<string, string | null>)[`${native.toLowerCase()}Balance`] ?? "0");
  
  //     // 5️⃣ Check token balance
  //     if (tokenBalance < amount) {
  //       return new Response(JSON.stringify({ success: false, error: `Insufficient ${token} balance for withdrawal` }), { status: 400 });
  //     }
  
  //     // 6️⃣ Gas fee (0.1% of amount)
  //     const gasFee = amount * 0.001;
  //     if (nativeBalance < gasFee) {
  //       return new Response(JSON.stringify({ success: false, error: `Insufficient ${native} gas fee to cover for withdrawal` }), { status: 400 });
  //     }
  
  //     // 7️⃣ Insert withdrawal request
  //     await db.insert(transactions).values({
  //       userId: session.user.id,
  //       token,
  //       amount,
  //       type: "WITHDRAW",
  //       withdrawalWallet,
  //       status: "PENDING",
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     });
  //     return new Response(JSON.stringify({ success: true }), { status: 200 });
  
  //   } catch (err) {
  //     console.error(err);
  //     return new Response(JSON.stringify({ success: false, error: "Server error processing withdrawal" }), { status: 500 });
  //   }
  // }
