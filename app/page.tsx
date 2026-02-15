"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/features/hooks/useAuth";

import bg from "@/app/assets/library-bg.jpg"; // 👈 change to your image name

export default function SplashPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // 🔹 Redirect if already logged in
  useEffect(() => {
    if (loading) return;

    if (!user) return; // stay on splash until user clicks

    if (user.role === "PATRON") {
      router.replace("/portal");
    } else {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  const handleStart = () => {
    router.push("/auth/login");
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src={bg}
        alt="Library background"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Welcome to LibraryConnect
        </h1>

        <p className="text-lg md:text-xl text-gray-200 max-w-xl mb-10">
          A smarter way to manage library resources, documents,
          and member services — all in one secure platform.
        </p>

        {/* CTA */}
        <button
          onClick={handleStart}
          className="bg-white text-black font-semibold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition cursor-pointer"
        >
          Get Started →
        </button>

        {/* Optional hint */}
        <p className="text-gray-300 text-sm mt-6 animate-pulse cursor-pointer">
          Swipe or tap to continue
        </p>
      </div>
    </div>
  );
}
