import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import React from "react";

const page = () => {
  return (
    <>
      <form
        action={async () => {
          "use server";

          await signOut();
        }}
        className="mb-10 "
      >
        <Button className="cursor-pointer">Logout</Button>

        {/* This is where I put the user's dashboard */}

        <h1 className="text-white">Dashboard goes here!</h1>
      </form>
    </>
  );
};

export default page;
