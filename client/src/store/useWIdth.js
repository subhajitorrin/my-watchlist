import { create } from "zustand";
export const useWidth = create((set) => ({
  isMobile: window.innerWidth,
  setInnerWidth: (width) => {
    set({ isMobile: width <= 768 ? true : false });
  }
}));
