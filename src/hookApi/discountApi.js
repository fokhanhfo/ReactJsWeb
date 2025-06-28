import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "api/baseQuery";
import StorageKeys from "constants/storage-keys";
export const discountApi = createApi({
    reducerPath:'discountApi',
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
        getDiscount : builder.query({
            query:(params)=>{
                const queryParams = { ...params, page: params.page - 1 };
                return {
                    url: 'discount',
                    method: 'GET',
                    params: queryParams
                }
            },
            providesTags:(result)=>
              result ? [{ type: 'Discount', id: 'LIST' }] : [{ type: 'Discount', id: 'LIST' }],
        }),
        addToDiscount: builder.mutation({
            query: (newItem) => ({
              url: 'discount',
              method: 'POST',
              body: newItem,
            }),
            invalidatesTags: [{ type: 'Discount', id: 'LIST' }],
        }),
        getIdDiscount: builder.query({
            query: (id) => `discount/${id}`,
            providesTags: (result, error, id) => [{ type: 'Discount', id }],
        }),        
        updateDiscount: builder.mutation({
            query: (updatedItem) => ({
                url: `discount`,
                method: 'PUT',
                body: updatedItem,
            }),
            invalidatesTags: [{ type: 'Discount', id: 'LIST' }],
        }),
        updateStatusDiscount: builder.mutation({
            query: (updatedItem) => ({
                url: `discount/update-status`,
                method: 'PUT',
                body: updatedItem,
            }),
            invalidatesTags: [{ type: 'Discount', id: 'LIST' }],
        }),
        deletediscount : builder.mutation({
            query:(id) => ({
                url: `discount/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Discount', id: 'LIST' }],
        }),
        clearDiscount: builder.mutation({  // Đổi tên thành clearDiscount
            queryFn: () => ({ data: null }), // Không cần request, chỉ cần xóa state
            invalidatesTags: [{ type: 'Discount', id: 'LIST' }],
        }),
    }),
});

export const { 
    useGetDiscountQuery,
    useAddToDiscountMutation,
    useUpdateDiscountMutation,
    useDeletediscountMutation,
    useClearDiscountMutation,
    useGetIdDiscountQuery,
    useUpdateStatusDiscountMutation} = discountApi;
