import axios from "axios";
import axiosClient from "./axiosClient";

const userApi = {
    register(data){
        const url = `/auth/local/register`;
        return axiosClient.post(url,data);
    },
    login(data){
        const url = `/auth/token`;
        return axiosClient.post(url,data);
    },
};

export default userApi;