import { auth } from "@/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const layout = async ({ children }: { children: ReactNode }) => {

  const session = await auth();

  if (session) {
    // If the user is already authenticated, redirect them to the home page
    redirect("/");
  }
  return (
    <main className="auth-container">
      <section className="auth-form">
        <div className="auth-box">
          <div className="flex flex-row gap-3 items-center">
            <Image src={"/icons/logo.svg"} alt="logo" width={37} height={37} />
            <h1 className="text-2xl font-semibold text-white">CoinChain</h1>
          </div>
          <div>{children}</div>
        </div>
      </section>
      <section className="auth-illustration bg-light-200">
        <Image src={"/images/auth-illustration.png"} alt="auth illustration" width={1000} height={1000} className="size-full object-cover" />
      </section>
    </main>
  );
};

export default layout;
