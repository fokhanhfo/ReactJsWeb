import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "api/baseQuery";
import StorageKeys from "constants/storage-keys";
export const discountUserApi = createApi({
    reducerPath:'discountUserApi',
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
        getDiscountUsers:builder.query({
            query:(params)=>{
                const queryParams = { ...params, page: params.page - 1 };
                return {
                    url: 'discountUser',
                    method: 'GET',
                    params: queryParams
                }
            },
            providesTags: (result) =>
                result ? [{ type: 'DiscountUser', id: 'LIST' }] : [{ type: 'DiscountUser', id: 'LIST' }],
        }),
        getDiscountsByUserId: builder.query({
            query: (params) => ({
                url: 'discountUser/user',
                params: params,
            }),
            providesTags: (result) => [{ type: 'DiscountUser', id: 'USER' }],
        }),
        addDiscountUser: builder.mutation({
            query: (newDiscountUser) => {
                const isFormData = newDiscountUser instanceof FormData;
                return {
                    url: "discountUser",
                    method: "POST",
                    body: newDiscountUser,
                    formData: isFormData,
                };
            },
            invalidatesTags: [{ type: 'DiscountUser', id: 'LIST' }],
        }),
        addAllDiscountUser: builder.mutation({
            query: (newDiscountUser) => {
                const isFormData = newDiscountUser instanceof FormData;
                return {
                    url: "discountUser/addAll",
                    method: "POST",
                    body: newDiscountUser,
                    formData: isFormData,
                };
            },
            invalidatesTags: [{ type: 'DiscountUser', id: 'LIST' }],
        }),
        updateDiscountUser: builder.mutation({
            query: (DiscountUser) => {
                return {
                    url: "discountUser",
                    method: "PUT",
                    body: DiscountUser,
                };
            },
            invalidatesTags: [{ type: 'DiscountUser', id: 'LIST' }],
        }),
        deleteDiscountUser : builder.mutation({
            query:(id) => ({
                url: `discountUser/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'DiscountUser', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetDiscountUsersQuery,
    useAddDiscountUserMutation,
    useUpdateDiscountUserMutation,
    useAddAllDiscountUserMutation,
    useDeleteDiscountUserMutation,
    useGetDiscountsByUserIdQuery,
} = discountUserApi;
