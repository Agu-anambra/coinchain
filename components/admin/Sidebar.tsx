"use client";

import { adminSideBarLinks } from "@/constants";
import { cn, getInitials } from "@/lib/utils";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";

const Sidebar = ({session}:{session:Session}) => {
  const pathname = usePathname();
  return (
    <div className="admin-sidebar">
      <div>
        <div className="logo">
          <Image
            src="/icons/admin/logo.svg"
            alt="logo"
            width={37}
            height={37}
          />
          <h1>Coinchain</h1>
        </div>
        <div className="mt-10 flex flex-col gap-5">
          {adminSideBarLinks.map((link) => {
            const isSelected =
              (link.route !== "/admin" &&
                pathname.includes(link.route) &&
                link.route.length > 1) ||
              pathname === link.route;
            return (
              <Link
                key={link.route}
                href={link.route}
                className={cn(
                  "link",
                  isSelected && "bg-primary-admin shadow-sm"
                )}
              >
                <div className="relative size-5">
                  <Image
                    src={link.img}
                    alt={link.text}
                    fill
                    className={`${isSelected} && 'brightness-0 invert'  object-contain`}
                  />
                </div>
                <p className={cn(isSelected ? "text-white" : "text-dark-100")}>
                  {link.text}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="user items-center">
        <Avatar>
          <AvatarFallback className="bg-amber-100">
            {getInitials(session?.user?.name || "IN")}
          </AvatarFallback>
        </Avatar>

        <div className='flex flex-col max-md:hidden'>
            <p className="font-semibold text-dark-200">{session?.user?.name}</p>
            <p className="text-xs text-light-500">{session?.user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
