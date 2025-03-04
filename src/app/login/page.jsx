"use client";
import { useRouter, useSearchParams } from "next/navigation"; // Next.js 13+ için

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const username = formData.get("username");
    const password = formData.get("password");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const { success } = await res.json();
    if (success) {
      const urlParams = new URLSearchParams(window.location.search);
      const nextUrl = urlParams.get("next");
      const redirectUrl = nextUrl ? decodeURIComponent(nextUrl) : "/";
      console.log("urlParams : ", urlParams , " nextUrl : ", nextUrl ,  " redirectUrl : ",redirectUrl);
      
      
      router.push(redirectUrl);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" name="username" />
      </label>
      <label>
        Password:
        <input type="password" name="password" />
      </label>
      <button type="submit">Login</button>
    </form>
  );
}
