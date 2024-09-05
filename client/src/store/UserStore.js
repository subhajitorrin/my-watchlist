/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
import { create } from "zustand";
import axios from "axios";
import { useVideo } from "./VideoStore";

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
      const { clearLibrary } = useVideo.getState();
      clearLibrary();
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('library');
      sessionStorage.removeItem('queue');
    } catch (error) {
      throw error
    } finally {
      set({ isLoading: false })
    }
  },
}));

