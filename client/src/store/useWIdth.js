import { create } from "zustand";
export const useWidth = create((set) => ({
  innerWidth: window.innerWidth,
  setInnerWidth: (width) => {
    set({ innerWidth: width });
  }
}));
