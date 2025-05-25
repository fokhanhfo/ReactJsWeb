import axios from "axios";
import axiosClient from "./axiosClient";
import { login } from "features/Auth/userSlice";

const userApi = {
    register(data){
        const url = `/user/add`;
        return axiosClient.post(url,data);
    },
    login(data){
        const url = `/auth/token`;
        return axiosClient.post(url,data);
    },
    refresh(data){
        const url = `/auth/refresh`;
        return axiosClient.post(url,data);
    },
    facebookLogin(data){
        const url = `/auth/facebook-login`;
        return axiosClient.post(url,data);
    },
    myInfor(id){
        const url = `/user/myInfo`;
        return axiosClient.get(url);
    },
    getAll(){
        const url = `/user`;
        return axiosClient.get(url);
    }
};

export default userApi;