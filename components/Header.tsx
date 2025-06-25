import Image from "next/image";
import Link from "next/link";
import React from "react";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="my-2 md:my-5 flex justify-between gap-5">
      <Link
        href="/"
        className="text-white text-lg md:text-2xl font-bold flex items-center gap-2"
      >
        <Image
          src="/assets/images/COINCHAIN.png"
          alt="logo"
          width={40}
          height={40}
        />
        Coinchain
      </Link>
      <div className="flex gap-2 md:gap-5">
        <ul className="flex flex-row items-center gap-8">
          <li>
            <form
              action={async () => {
                "use server";

                await signOut();
              }}
              className="mb-0 "
            >
              <Button className="cursor-pointer text-dark-100">Logout</Button>
            </form>
          </li>
        </ul>
        <Link
          href="/wallet-access"
          className="flex items-center border border-white text-white hover:text-dark-100 text-xs md:text-sm md:font-medium px-2 md:px-4 py-0 md:py-2 rounded-xl hover:bg-primary transition"
        >
          Wallet
        </Link>
      </div>
    </header>
  );
};

export default Header;
