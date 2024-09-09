import { create } from "zustand";
export const useWidth = create((set) => ({
  isMobile: window.innerWidth <= 768 ? true : false,
  setInnerWidth: (width) => {
    set({ isMobile: width <= 768 ? true : false });
  }
}));
