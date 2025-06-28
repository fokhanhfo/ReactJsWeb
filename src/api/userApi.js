import axios from "axios";
import axiosClient from "./axiosClient";
import { login } from "features/Auth/userSlice";

const userApi = {
    register(data, file) {
        const url = `/user/add`;

        const formData = new FormData();
        formData.append("userRequest", new Blob([JSON.stringify(data)], { type: "application/json" }));
        if (file) {
            formData.append("file", file);
        }

        return axiosClient.post(url, formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });
    },
    verifyOtp(email, otp, purpose) {
        const url = `/user/verify-otp`;
        const params = new URLSearchParams({ email, otp,purpose });

        return axiosClient.post(`${url}?${params.toString()}`);
    },
    resendOtp(email,purpose) {
        const url = `/user/resendOtp`;
        const params = new URLSearchParams({ email,purpose});

        return axiosClient.post(`${url}?${params.toString()}`);
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
    },
    getDataStatistics(){
        const url = `/user/getDataStatistics`;
        return axiosClient.get(url);
    }
};

export default userApi;