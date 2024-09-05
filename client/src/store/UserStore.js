/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
import { create } from "zustand";
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;
axios.defaults.withCredentials = true;

export const useUser = create((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  isAuthChecking: true,
  library: [],
  registerUser: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(`${BASE_URL}/register`, {
        name,
        email,
        password
      });
      console.log(res);
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  loginUser: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(`${BASE_URL}/login`, { email, password });
      console.log(res);
      const user = {
        name: res.data.user.name,
        email: res.data.user.email,
        id: res.data.user._id
      };
      set({ isAuthenticated: true, user });
      sessionStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  getUser: async () => {
    try {
      const storedData = sessionStorage.getItem("user");
      const user = storedData ? JSON.parse(storedData) : null;
      if (user !== null) {
        set({ isAuthenticated: true, user });
      } else {
        const res = await axios.get(`${BASE_URL}/getuser`);
        const user = {
          name: res.data.user.name,
          email: res.data.user.email,
          id: res.data.user._id
        };
        set({ isAuthenticated: true, user });
        sessionStorage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {
      throw error;
    } finally {
      set({ isAuthChecking: false });
    }
  },
  logout: async () => {
    set({ isLoading: true })
    try {
      const res = await axios.post(`${BASE_URL}/logout`)
      console.log(res);
      set({ user: null, isAuthenticated: false })
      sessionStorage.removeItem('user');
    } catch (error) {
      throw error
    } finally {
      set({ isLoading: false })
    }
  },
}));

export const useVideo = create((set, get) => ({
  library: [],
  isLoading: false,
  addVideoToLibrary:async (url)=>{
    set({isLoading:true})
    try {
      const res = await axios.post(`${BASE_URL}/add-video-to-library`,{url})
      console.log(res);
    } catch (error) {
      throw error
    }finally{
      set({isLoading:false})
    }
  },
  getLibrary: async () => {
    set({ isLoading: true })
    try {
      const res = await axios.get(`${BASE_URL}/get-library`)
      set({library:res.data.library})
    } catch (error) {
      throw error;
    }finally{
      set({ isLoading: false })
    }
  },
  formatTime:(seconds)=>{
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    let result = ""

    if(formattedHours!=="00"){
      result=`${formattedHours} : ${formattedMinutes} : ${formattedSeconds} hr`
    }else{
      result=`${formattedMinutes} : ${formattedSeconds} min`
    }
    
    return result;
  }
}))