import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "api/baseQuery";
import StorageKeys from "constants/storage-keys";
export const categoryApi = createApi({
    reducerPath:'categoryApi',
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
        getCategory : builder.query({
            query:()=>"category",
            providesTags:(result)=>
              result ? [{ type: 'Category', id: 'LIST' }] : [{ type: 'Category', id: 'LIST' }],
        }),
        addToCategory: builder.mutation({
            query: (newItem) => ({
              url: 'category',
              method: 'POST',
              body: newItem,
            }),
            invalidatesTags: [{ type: 'Category', id: 'LIST' }],
        }),
        updateCategory: builder.mutation({
            query: (updatedItem) => ({
                url: `category/${updatedItem.id}`,
                method: 'PUT',
                body: updatedItem,
            }),
            invalidatesTags: [{ type: 'Category', id: 'LIST' }],
        }),
        deletecategory : builder.mutation({
            query:(id) => ({
                url: `category/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Category', id: 'LIST' }],
        }),
        clearCategory: builder.mutation({  // Đổi tên thành clearCategory
            queryFn: () => ({ data: null }), // Không cần request, chỉ cần xóa state
            invalidatesTags: [{ type: 'Category', id: 'LIST' }],
        }),
    }),
});

export const { useGetCategoryQuery,useAddToCategoryMutation,useUpdateCategoryMutation,useDeletecategoryMutation,useClearCategoryMutation} = categoryApi;
