import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "api/baseQuery";
import StorageKeys from "constants/storage-keys";
export const colorApi = createApi({
    reducerPath:'colorApi',
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
        getColor : builder.query({
            query:()=>"product/color",
            providesTags:(result)=>
              result ? [{ type: 'Color', id: 'LIST' }] : [{ type: 'Color', id: 'LIST' }],
        }),
        addToColor: builder.mutation({
            query: (newItem) => ({
              url: 'product/color',
              method: 'POST',
              body: newItem,
            }),
            invalidatesTags: [{ type: 'Color', id: 'LIST' }],
        }),
        updateColor: builder.mutation({
            query: (updatedItem) => ({
                url: `product/color/${updatedItem.id}`,
                method: 'PUT',
                body: updatedItem,
            }),
            invalidatesTags: [{ type: 'Color', id: 'LIST' }],
        }),
        deletecolor : builder.mutation({
            query:(id) => ({
                url: `product/color/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Color', id: 'LIST' }],
        }),
        clearColor: builder.mutation({  // Đổi tên thành clearColor
            queryFn: () => ({ data: null }), // Không cần request, chỉ cần xóa state
            invalidatesTags: [{ type: 'Color', id: 'LIST' }],
        }),
    }),
});

export const { useGetColorQuery,useAddToColorMutation,useUpdateColorMutation,useDeletecolorMutation,useClearColorMutation} = colorApi;
