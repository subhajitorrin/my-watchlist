/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
import {create} from "zustand"
import axios from "axios"

const BASE_URL = `${import.meta.env.VITE_BASE_URL}`

export const useUser = create((set,get)=>({
    user:null,
    isLoading:false,
    googleLogin:async (code)=>{
        try {
            const res = await axios.post(`${BASE_URL}/google-login`,code);
            console.log(res);
        } catch (error) {
            throw error;
        }
    }

}))