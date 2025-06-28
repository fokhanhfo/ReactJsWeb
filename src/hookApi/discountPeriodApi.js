import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "api/baseQuery";
import StorageKeys from "constants/storage-keys";
export const discountPeriodApi = createApi({
    reducerPath:'discountPeriodApi',
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
        getDiscountPeriod : builder.query({
            query:()=>"discountPeriod",
            providesTags:(result)=>
              result ? [{ type: 'DiscountPeriod', id: 'LIST' }] : [{ type: 'DiscountPeriod', id: 'LIST' }],
        }),
        addToDiscountPeriod: builder.mutation({
            query: (newItem) => ({
              url: 'discountPeriod',
              method: 'POST',
              body: newItem,
            }),
            invalidatesTags: [{ type: 'DiscountPeriod', id: 'LIST' }],
        }),
        getIdDiscountPeriod: builder.query({
            query: (id) => `discountPeriod/${id}`,
            providesTags: (result, error, id) => [{ type: 'DiscountPeriod', id }],
        }),        
        updateDiscountPeriod: builder.mutation({
            query: (updatedItem) => ({
                url: `discountPeriod`,
                method: 'PUT',
                body: updatedItem,
            }),
            invalidatesTags: [{ type: 'DiscountPeriod', id: 'LIST' }],
        }),
        deletediscountPeriod : builder.mutation({
            query:(id) => ({
                url: `discountPeriod/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'DiscountPeriod', id: 'LIST' }],
        }),
        clearDiscountPeriod: builder.mutation({  // Đổi tên thành clearDiscountPeriod
            queryFn: () => ({ data: null }), // Không cần request, chỉ cần xóa state
            invalidatesTags: [{ type: 'DiscountPeriod', id: 'LIST' }],
        }),
    }),
});

export const { 
    useGetDiscountPeriodQuery,
    useAddToDiscountPeriodMutation,
    useUpdateDiscountPeriodMutation,
    useDeletediscountPeriodMutation,
    useClearDiscountPeriodMutation,
    useGetIdDiscountPeriodQuery} = discountPeriodApi;
