import Image from "next/image";
import Link from "next/link";
import React from "react";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="my-5 flex justify-between gap-5">
      <Link
        href="/"
        className="text-white text-2xl font-bold flex items-center gap-2"
      >
        <Image
          src="/assets/images/COINCHAIN.png"
          alt="logo"
          width={40}
          height={40}
        />
        Coinchain
      </Link>
      <div className="flex gap-5">
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
          href="#"
          className="flex items-center border border-white text-white hover:text-dark-100 text-sm font-medium px-4 py-2 rounded-full hover:bg-primary transition"
        >
          Wallet
        </Link>
      </div>
    </header>
  );
};

export default Header;
