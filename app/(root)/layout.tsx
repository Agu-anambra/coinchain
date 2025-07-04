import { auth } from "@/auth";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import Head from "next/head";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session) {
    // If the user is already authenticated, redirect them to the home page
    redirect("/sign-in");
  }

  after(async () => {
    if (!session?.user?.id) return;

    // Get the user and see if the last activity date is today
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session?.user?.id))
      .limit(1);

    // If the last activity date is today, do not update
    if (user[0]?.lastActivityDate === new Date().toISOString().slice(0, 10))
      return;

    // Update the last activity date to today
    await db
      .update(users)
      .set({
        lastActivityDate: new Date().toISOString().slice(0, 10),
      })
      .where(eq(users.id, session.user.id));
  });
  return (
    <>
      <main className="root-container">
        <div className="mx-auto max-w-7xl">
          <Header session={session} />
          <div className="mt-20">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Layout;
