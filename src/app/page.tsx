"use client";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col justify-center gap-8 row-start-2 items-center">
        <h1 className="font-medium text-7xl">Gmail Cleanser</h1>
        {!session ? (
          <Button
            size={"xl"}
            variant={"outline"}
            rounded={"full"}
            onClick={() => signIn("google", { redirectTo: "/dashboard" })}
          >
            Sign in with Google
          </Button>
        ) : (
          <Button asChild size={"xl"} variant={"outline"} rounded={"full"}>
            <Link href={"/dashboard"}>Go to Dashboard</Link>
          </Button>
        )}
      </main>
      
        
    </div>
  );
}
