import { create } from "zustand";
import { User } from "@/types/user";

type AuthStore = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,

  setUser: (user) => {
    if (user) {
      localStorage.setItem("lc_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("lc_user");
    }
    set({ user });
  },

  logout: () => {
    localStorage.removeItem("lc_user");
    set({ user: null });
  },
}));
