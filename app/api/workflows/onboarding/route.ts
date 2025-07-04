import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { sendEmail } from "@/lib/workflow";
import { serve } from "@upstash/workflow/nextjs"
import { eq } from "drizzle-orm";

type UserState = "non-active" | "active";

type InitialData = {
  email: string,
  fullName: string
}

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const THREE_DAYS_IN_MS = 3 * ONE_DAY_IN_MS;
const THIRTY_DAYS_IN_MS = 30 * ONE_DAY_IN_MS;

const getUserState = async (email: string): Promise<UserState> => {
const user = await db
    .select()
    .from(users)
    .where(
      eq(users.email, email)
    )
    .limit(1)

  if (user.length === 0) return "non-active";
  const lastActivityDate = new Date(user[0].lastActivityDate!);
  const today = new Date();
  const timeDifference = today.getTime() - lastActivityDate.getTime();
  // const daysSinceLastActivity = Math.floor((today.getTime() - lastActivityDate.getTime()) / ONE_DAY_IN_MS);
  // return daysSinceLastActivity > 30 ? "non-active" : "active";

  if (timeDifference > THREE_DAYS_IN_MS && timeDifference <= THIRTY_DAYS_IN_MS) {
    return 'non-active'
  }
  return "active";

}

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload

  // Welcome email to new users
  await context.run("new-signup", async () => {
    await sendEmail({
      email, 
      subject: 'Welcome to Coinchain', 
      message: `Hi ${fullName}, it is good to have you on board!` 
    })
  })

  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3)

  while (true) {
    const state = await context.run("check-user-state", async () => {
      return await getUserState(email)
    })

    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await sendEmail({
          email, 
          subject: 'Hey!, We miss you at Coinchain', 
          message: `Hello ${fullName}, we noticed you haven't been active for a while. We would love to have you back!` 
        })
      })
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        await sendEmail({
          email, 
          subject: 'Welcome back!', 
          message: `Hi ${fullName}, thank you for staying active on Coinchain! We appreciate your engagement.` 
        })
      })
    }

    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30)
  }
})
