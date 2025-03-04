"use client";
import { useAuth } from "@/app/hooks/useAuth";
import Link from "next/link";

export function Header() {
  const auth = useAuth();

  // server side kullanım
  /* const currentUser = await useAuth.fromServer(); */

  console.log("auth : ", auth);

  return (
    <header>
      <div>
        <Link href="/">Logo</Link>
      </div>
      <nav>
        <Link href="/panel">Panel (Protected Route)</Link>
        <Link href="/login">Login</Link>
      </nav>
    </header>
  );
}

export default Header;
