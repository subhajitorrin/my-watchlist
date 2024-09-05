/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
import { create } from "zustand";
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;
axios.defaults.withCredentials = true;

export const useVideo = create((set, get) => ({
  library: [],
  isLoading: false,
  addVideoToLibrary: async (url) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(`${BASE_URL}/add-video-to-library`, { url });
      console.log(res);
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  getLibrary: async () => {
    set({ isLoading: true });
    try {
      const storedData = sessionStorage.getItem("library");
      const tempLib = storedData ? JSON.parse(storedData) : null;
      if (tempLib !== null) {
        set({ library: tempLib });
      } else {
        const res = await axios.get(`${BASE_URL}/get-library`);
        const lib = res.data.library;
        set({ library: lib });
        sessionStorage.setItem("library", JSON.stringify(lib));
      }
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  formatTime: (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

    let result = "";

    if (formattedHours !== "00") {
      result = `${formattedHours} : ${formattedMinutes} : ${formattedSeconds} hr`;
    } else {
      result = `${formattedMinutes} : ${formattedSeconds} min`;
    }

    return result;
  },
  clearLibrary: () => {
    set({ library: [] });
  }
}));
