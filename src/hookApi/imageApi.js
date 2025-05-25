import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "api/baseQuery";
import StorageKeys from "constants/storage-keys";
export const imageApi = createApi({
    reducerPath:'imageApi',
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
        getImage : builder.query({
            query:()=>"image",
            providesTags:(result)=>
              result ? [{ type: 'Image', id: 'LIST' }] : [{ type: 'Image', id: 'LIST' }],
        }),
        getImageAllPDId : builder.query({
            query:(id)=>`image/productDetail/${id}`,
            providesTags:(result)=>
              result ? [{ type: 'Image', id: 'LIST' }] : [{ type: 'Image', id: 'LIST' }],
        }),
        getImageAllProductId: builder.query({
            query: (id) => `image/product/${id}`, // ✅ Kiểm tra đường dẫn API
            providesTags: [{ type: "Image", id: "LIST" }], // ✅ Tối ưu providesTags
        }),
        addToImage: builder.mutation({
            query: (newItem) => ({
              url: 'image',
              method: 'POST',
              body: newItem,
            }),
            invalidatesTags: [{ type: 'Image', id: 'LIST' }],
        }),
        updateImage: builder.mutation({
            query: (updatedItem) => ({
                url: `image/${updatedItem.id}`,
                method: 'PUT',
                body: updatedItem,
            }),
            invalidatesTags: [{ type: 'Image', id: 'LIST' }],
        }),
        deleteimage : builder.mutation({
            query:(id) => ({
                url: `image/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Image', id: 'LIST' }],
        }),
        clearImage: builder.mutation({  // Đổi tên thành clearImage
            queryFn: () => ({ data: null }), // Không cần request, chỉ cần xóa state
            invalidatesTags: [{ type: 'Image', id: 'LIST' }],
        }),
    }),
});

export const { useGetImageQuery,useGetImageAllProductIdQuery,useGetImageAllPDIdQuery,useAddToImageMutation,useUpdateImageMutation,useDeleteimageMutation,useClearImageMutation} = imageApi;
