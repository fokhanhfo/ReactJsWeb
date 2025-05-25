import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "api/baseQuery";
import StorageKeys from "constants/storage-keys";
export const discountProductPeriodApi = createApi({
    reducerPath:'discountProductPeriodApi',
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
        getDiscountProductPeriod:builder.query({
            query:(params)=>{
                const queryParams = { ...params, page: params.page - 1 };
                return {
                    url: 'discountProductPeriod',
                    method: 'GET',
                    params: queryParams
                }
            },
            providesTags: (result) =>
                result ? [{ type: 'DiscountProductPeriod', id: 'LIST' }] : [{ type: 'DiscountProductPeriod', id: 'LIST' }],
        }),
        getDiscountsByUserId: builder.query({
            query: (params) => ({
                url: 'discountProductPeriod/user',
                params: params,
            }),
            providesTags: (result) => [{ type: 'DiscountProductPeriod', id: 'USER' }],
        }),
        addDiscountProductPeriod: builder.mutation({
            query: (newDiscountProductPeriod) => {
                const isFormData = newDiscountProductPeriod instanceof FormData;
                return {
                    url: "discountProductPeriod",
                    method: "POST",
                    body: newDiscountProductPeriod,
                    formData: isFormData,
                };
            },
            invalidatesTags: [{ type: 'DiscountProductPeriod', id: 'LIST' }],
        }),
        addAllDiscountProductPeriod: builder.mutation({
            query: (newDiscountProductPeriod) => {
                const isFormData = newDiscountProductPeriod instanceof FormData;
                return {
                    url: "discountProductPeriod/addAll",
                    method: "POST",
                    body: newDiscountProductPeriod,
                    formData: isFormData,
                };
            },
            invalidatesTags: [{ type: 'DiscountProductPeriod', id: 'LIST' }],
        }),
        updateDiscountProductPeriod: builder.mutation({
            query: (DiscountProductPeriod) => {
                return {
                    url: "discountProductPeriod",
                    method: "PUT",
                    body: DiscountProductPeriod,
                };
            },
            invalidatesTags: [{ type: 'DiscountProductPeriod', id: 'LIST' }],
        }),
        deleteDiscountProductPeriod : builder.mutation({
            query:(id) => ({
                url: `discountProductPeriod/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'DiscountProductPeriod', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetDiscountProductPeriodQuery,
    useAddDiscountProductPeriodMutation,
    useUpdateDiscountProductPeriodMutation,
    useAddAllDiscountProductPeriodMutation,
    useDeleteDiscountProductPeriodMutation,
    useGetDiscountsByUserIdQuery,
} = discountProductPeriodApi;
