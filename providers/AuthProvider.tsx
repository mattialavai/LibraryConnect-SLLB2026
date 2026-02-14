"use client";

import { createContext, useContext, useState } from "react";
import { User } from "@/types/user";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
