import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "api/baseQuery";
import StorageKeys from "constants/storage-keys";
export const userApi = createApi({
    reducerPath:'userApi',
    baseQuery: baseQueryWithReauth,
    // baseQuery : fetchBaseQuery({
    //     baseUrl:"http://localhost:8080",
    //     prepareHeaders: (headers) => {
    //         const token = localStorage.getItem(StorageKeys.TOKEN);
    //         if (token) {
    //           headers.set('Authorization', `Bearer ${token}`);
    //         }
    //         return headers;
    //       },
    // }),
    endpoints: (builder)=>({
        getUsers:builder.query({
            query:(params)=>{
                console.log(params)
                const queryParams = { ...params, page: params.page - 1 };
                return {
                    url: 'user',
                    method: 'GET',
                    params: queryParams
                }
            },
            providesTags: (result) =>
                result ? [{ type: 'User', id: 'LIST' }] : [{ type: 'User', id: 'LIST' }],
        }),
        addUser: builder.mutation({
            query: (newUser) => {
                const isFormData = newUser instanceof FormData;
                return {
                    url: "user",
                    method: "POST",
                    body: newUser,
                    formData: isFormData,
                };
            },
            invalidatesTags: [{ type: 'User', id: 'LIST' }],
        }),
        updateUser: builder.mutation({
            query: (User) => {
                return {
                    url: "user",
                    method: "PUT",
                    body: User,
                };
            },
            invalidatesTags: [{ type: 'User', id: 'LIST' }],
        }),
    }),
});

export const {useGetUsersQuery,useAddUserMutation,useUpdateUserMutation} = userApi;
