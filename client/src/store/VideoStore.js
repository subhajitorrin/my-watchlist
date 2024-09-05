/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
import { create } from "zustand";
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;
axios.defaults.withCredentials = true;

export const useVideo = create((set, get) => ({
  library: [],
  queue: [],
  isLoading: false,
  currnetVideo:null,
  addVideoToLibrary: async (url) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(`${BASE_URL}/add-video-to-library`, { url });
      set((prev) => ({
        library: [res.data.video, ...prev.library]
      }));
      const libraryFromSession = get().getLibraryFromSession();
      if (libraryFromSession !== null) {
        const updatedSession = [res.data.video, ...libraryFromSession];
        sessionStorage.setItem("library", JSON.stringify(updatedSession));
      } else {
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
      if (libraryFromSession !== null) {
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
  getLibraryFromSession: () => {
    const storedData = sessionStorage.getItem("library");
    return storedData ? JSON.parse(storedData) : null;
  },
  getQueueFromSession: () => {
    const storedData = sessionStorage.getItem("queue");
    return storedData ? JSON.parse(storedData) : null;
  },
  getISTdate: (utc) => {
    const date = new Date(utc);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  },
  getISTtime: (utc) => {
    const date = new Date(utc);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedTime = `${String(hours).padStart(
      2,
      "0"
    )}:${minutes} ${period}`;
    return formattedTime;
  },
  deleteVideo: async (id) => {
    try {
      const res = await axios.put(`${BASE_URL}/delete-video/${id}`);
      const libraryFromSession = get().getLibraryFromSession();
      if (libraryFromSession) {
        const updatedSession = libraryFromSession.filter(
          (item) => item._id !== id
        );
        set({ library: updatedSession });
        sessionStorage.setItem("library", JSON.stringify(updatedSession));
      } else {
        const tempLibrary = get().library;
        const updatedSession = tempLibrary.filter((item) => item._id !== id);
        set({ library: updatedSession });
        sessionStorage.setItem("library", JSON.stringify(updatedSession));
      }
    } catch (error) {
      throw error;
    }
  },
  addVideoToQueue: async (videoId) => {
    try {

      const res = await axios.post(`${BASE_URL}/add-to-queue`, { videoId });
      const video = res.data.video;

      const tempLibrary = get().library.filter((item) => item._id !== videoId);
      set({ library: tempLibrary });
      sessionStorage.setItem("library", JSON.stringify(tempLibrary));

      const tempQueue = get().queue;
      const updatedQueue = [...tempQueue,video]
      set({queue:updatedQueue})
      sessionStorage.setItem("queue", JSON.stringify(updatedQueue));

      set({currnetVideo:updatedQueue[0]})

    } catch (error) {
      throw error;
    }
  },
  getQueue: async () => {
    set({ isLoading: true });
    try {
      const queueFromSession = get().getQueueFromSession();
      if (queueFromSession !== null) {
        set({ queue: queueFromSession,currnetVideo:queueFromSession[0] });
      } else {
        const res = await axios.get(`${BASE_URL}/get-queue`);
        const que = res.data.queue;
        set({ queue: que,currnetVideo:que[0] });
        sessionStorage.setItem("queue", JSON.stringify(que));
      }
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  removeVideoFromQueue:async(videoId)=>{
    set({isLoading:true})
    try {
      const res = await axios.put(`${BASE_URL}/remove-from-queue`,{videoId});
      console.log(res);
    } catch (error) {
      throw error
    }finally{
      set({isLoading:false})
    }
  }
}));
