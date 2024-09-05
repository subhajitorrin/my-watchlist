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
      set((prev) => ({
        library: [res.data.video, ...prev.library]
      }));
      const libraryFromSession = get().getLibraryFromSession();
      if(libraryFromSession!==null){
        const updatedSession = [res.data.video,...libraryFromSession]
        sessionStorage.setItem("library", JSON.stringify(updatedSession));
      }else{
        sessionStorage.setItem("library", JSON.stringify(res.data.video));
      }
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  getLibrary: async () => {
    set({ isLoading: true });
    try {
      const libraryFromSession = get().getLibraryFromSession();
      if (libraryFromSession!==null) {
        set({ library: libraryFromSession });
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
  },
  getLibraryFromSession:()=>{
    const storedData = sessionStorage.getItem("library");
    return storedData ? JSON.parse(storedData) : null;
  }
}));
