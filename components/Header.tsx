"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Header = () => {
  const pathName = usePathname();
  return (
    <header className="my-10 flex justify-between gap-5">
      <Link 
      href="/" 
      className="text-white text-2xl font-bold flex items-center gap-2"
      >
        <Image src="/assets/images/COINCHAIN.png" alt="logo" width={40} height={40} />
            Coinchain
      </Link>
      <div className="flex gap-5">
      <ul className="flex flex-row items-center gap-8">
        <li>
          <Link
            href="/plans"
            className={cn(
              "text-base capitalize cursor-pointer",
              pathName === "/plans" ? "text-light-200" : "text-light-100"
            )}
          >
            Plans
          </Link>
        </li>
      </ul>

      {/* dashboard profile image */}


      {/* connect wallet
      
      */}
      <Link href="#" className="hidden lg:inline-block border border-white text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-blue-600 transition">
            Wallet
          </Link>
          </div>
    </header>
  );
};

export default Header;
