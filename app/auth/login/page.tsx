"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/features/hooks/useAuth";
import { useTheme } from "@/providers/ThemeProvider"; // make sure your ThemeProvider wraps _app or layout

import logo from "@/app/assets/logo.png";
import bg1 from "@/app/assets/login-bg1.jpg";
import bg2 from "@/app/assets/login-bg2.jpg";

const mockUsers = [
  { email: "admin@sllb.sl", password: "admin123", role: "STAFF" },
  { email: "librarian@sllb.sl", password: "lib123", role: "STAFF" },
  { email: "patron@sllb.sl", password: "patron123", role: "PATRON" },
];

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  // Background slideshow
  useEffect(() => {
  const interval = setInterval(() => {
    setBgIndex((i) => (i + 1) % 2);
  }, 5000);

  return () => clearInterval(interval);
}, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      alert("Invalid credentials");
      setLoading(false);
      return;
    }

    setUser(foundUser);

    // role-based routing
    if (foundUser.role === "PATRON") router.replace("/portal");
    else router.replace("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT — IMAGE */}
        <div className="hidden md:block relative w-2/3 overflow-hidden rounded-tr-[40px]">
          {[bg1, bg2].map((img, i) => (
            <Image
              key={i}
              src={img}
              alt="Library"
              fill
              className={`object-cover transition-opacity duration-1000 ${
                i === bgIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute bottom-10 left-10 text-white max-w-md">
            <h1 className="text-3xl font-bold mb-2">LibraryConnect</h1>
            <p className="text-sm opacity-90">
              Manage collections, streamline operations, and connect your library ecosystem.
            </p>
          </div>
        </div>

      {/* RIGHT — FORM */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6 py-10 relative z-20">
        {/* Header */}
        <div className="flex justify-between w-full max-w-sm items-center mb-8">
          <div className="flex items-center gap-3">
            <Image src={logo} alt="logo" width={30} height={30} />
            <h1 className="text-lg font-bold text-primary">SLLB</h1>
          </div>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" className="cursor-pointer" onClick={toggleTheme}>
            {theme === "light" ? <Moon /> : <Sun />}
          </Button>
        </div>

        {/* Welcome Title */}
        <h2 className="text-xl font-semibold mb-6">Welcome to LibraryConnect</h2>

        {/* Login Form */}
        <Card className="w-full max-w-sm p-5 space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label>Password</Label>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="accent-primary"
                />
                Remember Me
              </label>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded text-white cursor-pointer"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-2">
            Credentials are provided by library administration
          </p>
        </Card>

        <p className="text-xs text-muted-foreground mt-8">
          LibraryConnect – Sierra Leone Library Board © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
