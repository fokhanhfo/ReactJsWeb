import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "api/baseQuery";
import StorageKeys from "constants/storage-keys";
export const cartApi = createApi({
    reducerPath:'cartApi',
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
        getCart : builder.query({
            query:()=>"cart",
            providesTags:(result)=>
              result ? [{ type: 'Cart', id: 'LIST' }] : [{ type: 'Cart', id: 'LIST' }],
        }),
        addToCart: builder.mutation({
            query: (newItem) => ({
              url: 'cart',
              method: 'POST',
              body: newItem,
            }),
            invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
        }),
        updateCart: builder.mutation({
            query: (updatedItem) => ({
                url: `cart/${updatedItem.id}`,
                method: 'PUT',
                body: updatedItem,
            }),
            invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
        }),
        deletecart : builder.mutation({
            query:(id) => ({
                url: `cart/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
        }),
        deleteAll: builder.mutation({
            query: () => ({
                url: 'cart',
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
        }),
        clearCart: builder.mutation({  // Đổi tên thành clearCart
            queryFn: () => ({ data: null }), // Không cần request, chỉ cần xóa state
            invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
        }),
    }),
});

export const { useGetCartQuery,useAddToCartMutation,useUpdateCartMutation,useDeletecartMutation,useDeleteAllMutation,useClearCartMutation} = cartApi;
