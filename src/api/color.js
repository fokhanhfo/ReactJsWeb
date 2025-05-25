import axiosClient from "./axiosClient";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const token = localStorage.getItem('access_token');


const colorApi = {
    getAll(params){
        const url = '/product/color';
        return axiosClient.get(url,{params});
    },

    get(id){
        const url = `/product/color/${id}`;
        return axiosClient.get(url);
    },

    add(data){
        const url = `/product/color`;
        return axiosClient.post(url,data,);
    },

    update(data){
        const url = `/product/color/${data.id}`;
        return axiosClient.put(url,data);
    },

    remove(id){
        const url = `/product/color/${id}`;
        return axiosClient.delete(url);
    },


};

export const colorApiRedux = createApi({
    reducerPath:'colorApi',
    baseQuery : fetchBaseQuery({
        baseUrl:"http://localhost:8080",
    }),
    endpoints: (builder)=>({
        getColor : builder.query({
            query:()=>"color",
            providesTags:(result)=>
              result ? [{ type: 'Color', id: 'LIST' }] : [{ type: 'color', id: 'LIST' }],
        }),
    }),
});

export const { useGetColorQuery} = colorApiRedux;

export default colorApi;