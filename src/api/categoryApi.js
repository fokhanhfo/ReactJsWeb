import axios from "axios";
import axiosClient from "./axiosClient";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const token = 'eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiIiLCJzdWIiOiJqb2huZG9lNCIsImV4cCI6MTcyNTI3MTQ1NywiaWF0IjoxNzIyNjc5NDU3LCJqdGkiOiI3NTdiYjNkYy0xOTU4LTQyNjItYjg4Zi04NDEyNzViZjA5YjIiLCJzY29wZSI6IlJPTEVfVVNFUiBBUFBST1ZFX1BPU1QifQ.cQaWG9Li8OI7l60wJEirCsu-adveot6DBD6KPb1xYfYQnr4C8UcN5Pl8nrMuVrZykowW9KnU5DcFNz8tImhjfA'


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
        const url = `/category/${data.id}`;
        return axiosClient.post(url,data);
    },

    update(data){
        const url = `/category/${data.id}`;
        return axiosClient.patch(url,data);
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
        prepareHeaders: (headers) => {
            if (token) {
              headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
          },
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