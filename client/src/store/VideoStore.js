import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;
axios.defaults.withCredentials = true;

export const useVideo = create(
  persist(
    (set, get) => ({
      library: [],
      queue: [],
      categories: [],
      tags: [],
      isLoading: false,
      currnetVideo: null,
      currentProgress: null,
      homeDropDownList: [
        { value: "recent", name: "Recent" },
        { value: "oldest", name: "Oldest" },
        { value: "today", name: "Today" },
        { value: "yesterday", name: "Yesterday" },
        { value: "last-3-days-ago", name: "Last 3 days ago" },
        { value: "short-duration", name: "Short Duration" },
        { value: "large-duration", name: "Large Duration" }
      ],
      homeDropDownValue: "recent",

      addVideoToLibrary: async (url) => {
        set({ isLoading: true });
        try {
          const res = await axios.post(`${BASE_URL}/add-video-to-library`, {
            url
          });
          set((prev) => ({
            library: [res.data.video, ...prev.library]
          }));
        } catch (error) {
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      getLibrary: async () => {
        const homeDropDownValue = get().homeDropDownValue;
        try {
          const res = await axios.get(`${BASE_URL}/get-library`, {
            params: {
              filterOption: homeDropDownValue
            }
          });
          set({ library: res.data.library });
        } catch (error) {
          throw error;
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
        } catch (error) {
          throw error;
        }
      },
      addVideoToQueue: async (videoId) => {
        try {
          const res = await axios.post(`${BASE_URL}/add-to-queue`, { videoId });
          const video = res.data.video;

          const tempLibrary = get().library.filter(
            (item) => item._id !== videoId
          );
          set({ library: tempLibrary });
          sessionStorage.setItem("library", JSON.stringify(tempLibrary));

          const tempQueue = get().queue;
          const updatedQueue = [...tempQueue, video];
          set({ queue: updatedQueue });
          sessionStorage.setItem("queue", JSON.stringify(updatedQueue));

          get().updateProgress();

          set({ currnetVideo: updatedQueue[0] });
        } catch (error) {
          throw error;
        }
      },
      getQueue: async () => {
        set({ isLoading: true });
        try {
          const queueFromSession = get().getQueueFromSession();
          if (queueFromSession !== null) {
            set({
              queue: queueFromSession,
              currnetVideo:
                queueFromSession.length > 0 ? queueFromSession[0] : null
            });
          } else {
            const res = await axios.get(`${BASE_URL}/get-queue`);
            const que = res.data.queue;
            set({ queue: que, currnetVideo: que.length > 0 ? que[0] : null });
            sessionStorage.setItem("queue", JSON.stringify(que));
          }
        } catch (error) {
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      removeVideoFromQueue: async (videoId) => {
        set({ isLoading: true });
        try {
          const res = await axios.put(`${BASE_URL}/remove-from-queue`, {
            videoId
          });
          const tempQueue = get().queue.filter((item) => item._id !== videoId);
          get().updateProgress();
          set({
            queue: tempQueue,
            currnetVideo: tempQueue.length > 0 ? tempQueue[0] : null
          });
          sessionStorage.setItem("queue", JSON.stringify(tempQueue));
        } catch (error) {
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      revertFromQueue: async (video) => {
        try {
          const videoId = video._id;
          const res = await axios.put(
            `${BASE_URL}/revert-from-queue-to-library`,
            {
              videoId
            }
          );
          const tempQueue = get().queue.filter((item) => item._id !== videoId);
          const tempLibrary = get().library;
          const updatedLibrary = [video, ...tempLibrary];
          get().updateProgress();
          set({
            queue: tempQueue,
            library: updatedLibrary,
            currnetVideo: tempQueue.length > 0 ? tempQueue[0] : null
          });
          sessionStorage.setItem("queue", JSON.stringify(tempQueue));
          sessionStorage.setItem("library", JSON.stringify(updatedLibrary));
        } catch (error) {
          throw error;
        }
      },
      updateProgress: async () => {
        const tempCurrnetVideo = get().currnetVideo;
        const tempCurrentProgress = get().currentProgress;
        if (tempCurrnetVideo === null || tempCurrentProgress === null) return;
        try {
          const res = await axios.put(`${BASE_URL}/update-progress`, {
            videoid: tempCurrnetVideo._id,
            sec: tempCurrentProgress
          });
          console.log(res);
        } catch (error) {
          throw error;
        }
      },
      getPlayback: async (videoid) => {
        try {
          const res = await axios.get(`${BASE_URL}/get-playback/${videoid}`);
          console.log(res.data.playback);
          return res.data.playback;
        } catch (error) {
          console.log(error);
          return 0;
        }
      },
      setCurrentProgress: async (sec) => {
        set({ currentProgress: sec });
      },
      getAllCategories: async () => {
        try {
          const res = await axios.get(`${BASE_URL}/get-categories`);
          console.log();
          set({ categories: res.data.categories.categories });
        } catch (error) {
          throw error;
        }
      },
      getAllTags: async () => {
        try {
          const res = await axios.get(`${BASE_URL}/get-tags`);
          set({ tags: res.data.tagslist });
        } catch (error) {
          throw error;
        }
      },
      setDropDownIndex(index) {
        set({
          homeDropDownValue: index
        });
      }
    }),
    {
      name: "mywatchlist-store",
      partialize: (state) => ({
        homeDropDownValue: state.homeDropDownValue,
        library: state.library
      }),
      getStorage: () => sessionStorage
    }
  )
);
