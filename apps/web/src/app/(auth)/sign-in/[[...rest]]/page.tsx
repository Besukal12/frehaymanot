"use client";
import { SignIn } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="w-full h-screen flex items-center justify-center p-4">
      <nav className="flex items-center gap-4">
        <SignIn />
      </nav>
    </header>
  );
}
