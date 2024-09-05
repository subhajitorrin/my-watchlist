/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
import {create} from "zustand"
import axios from "axios"

const BASE_URL = `${import.meta.env.VITE_BASE_URL}`

export const useUser = create((set,get)=>({
    user:null,
    isLoading:false,
    isAuthenticated:false,
    isAuthChecking:false,
    registerUser:async (name, email, password)=>{
        try {
            const res = await axios.post(`${BASE_URL}/register`,{name, email, password});
            console.log(res);
        } catch (error) {
            throw error;
        }
    }
}))