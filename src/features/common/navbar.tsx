"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect } from "react";
import { ThemeToggle } from "./theme-toggle";

export const Navbar = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error !== "RefreshTokenError") return
    signIn("google") // Force sign in to obtain a new set of access and refresh tokens
  }, [session?.error])

  return (
    <nav className="flex justify-between items-center gap-2 w-full py-2">
      <Link href="/" className="font-mono font-medium  tracking-wider">
        Gmail Cleanser
      </Link>
      <div className="flex items-center gap-4">
        <div>
          {!session ? (
            <Button
              variant={"link"}
              onClick={() => signIn("google", { redirectTo: "/dashboard" })}
            >
              Sign In
            </Button>
          ) : (
            <Button onClick={() => signOut()}>Sign Out</Button>
          )}
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
};
