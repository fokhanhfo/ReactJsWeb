import axiosClient from "./axiosClient";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const token = localStorage.getItem('access_token');


const categoryApi = {
    getAll(params){
        const url = '/category';
        return axiosClient.get(url,{params});
    },

    get(id){
        const url = `/category/${id}`;
        return axiosClient.get(url);
    },

    add(data){
        const url = `/category`;
        return axiosClient.post(url,data,);
    },

    update(data){
        const url = `/category/${data.id}`;
        return axiosClient.put(url,data);
    },

    remove(id){
        const url = `/category/${id}`;
        return axiosClient.delete(url);
    },


};

export const categoryApiRedux = createApi({
    reducerPath:'categoryApi',
    baseQuery : fetchBaseQuery({
        baseUrl:"http://localhost:8080",
    }),
    endpoints: (builder)=>({
        getCategory : builder.query({
            query:()=>"category",
            providesTags:(result)=>
              result ? [{ type: 'Category', id: 'LIST' }] : [{ type: 'category', id: 'LIST' }],
        }),
    }),
});

export const { useGetCategoryQuery} = categoryApiRedux;

export default categoryApi;