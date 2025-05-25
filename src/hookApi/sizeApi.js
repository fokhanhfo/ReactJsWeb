import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "api/baseQuery";
import StorageKeys from "constants/storage-keys";
export const sizeApi = createApi({
    reducerPath:'sizeApi',
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
        getSize : builder.query({
            query:()=>"product/size",
            providesTags:(result)=>
              result ? [{ type: 'Size', id: 'LIST' }] : [{ type: 'Size', id: 'LIST' }],
        }),
        addToSize: builder.mutation({
            query: (newItem) => ({
              url: 'product/size',
              method: 'POST',
              body: newItem,
            }),
            invalidatesTags: [{ type: 'Size', id: 'LIST' }],
        }),
        updateSize: builder.mutation({
            query: (updatedItem) => ({
                url: `product/size/${updatedItem.id}`,
                method: 'PUT',
                body: updatedItem,
            }),
            invalidatesTags: [{ type: 'Size', id: 'LIST' }],
        }),
        deletesize : builder.mutation({
            query:(id) => ({
                url: `product/size/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Size', id: 'LIST' }],
        }),
        clearSize: builder.mutation({  // Đổi tên thành clearSize
            queryFn: () => ({ data: null }), // Không cần request, chỉ cần xóa state
            invalidatesTags: [{ type: 'Size', id: 'LIST' }],
        }),
    }),
});

export const { useGetSizeQuery,useAddToSizeMutation,useUpdateSizeMutation,useDeletesizeMutation,useClearSizeMutation} = sizeApi;
