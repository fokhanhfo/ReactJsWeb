import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "api/baseQuery";
import StorageKeys from "constants/storage-keys";
export const roleApi = createApi({
    reducerPath:'roleApi',
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
        getRole : builder.query({
            query:()=>"roles",
            providesTags:(result)=>
              result ? [{ type: 'Role', id: 'LIST' }] : [{ type: 'Role', id: 'LIST' }],
        }),
        addToRole: builder.mutation({
            query: (newItem) => ({
              url: 'product/role',
              method: 'POST',
              body: newItem,
            }),
            invalidatesTags: [{ type: 'Role', id: 'LIST' }],
        }),
        updateRole: builder.mutation({
            query: (updatedItem) => ({
                url: `product/role/${updatedItem.id}`,
                method: 'PUT',
                body: updatedItem,
            }),
            invalidatesTags: [{ type: 'Role', id: 'LIST' }],
        }),
        deleterole : builder.mutation({
            query:(id) => ({
                url: `product/role/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Role', id: 'LIST' }],
        }),
        clearRole: builder.mutation({  // Đổi tên thành clearRole
            queryFn: () => ({ data: null }), // Không cần request, chỉ cần xóa state
            invalidatesTags: [{ type: 'Role', id: 'LIST' }],
        }),
    }),
});

export const { useGetRoleQuery,useAddToRoleMutation,useUpdateRoleMutation,useDeleteroleMutation,useClearRoleMutation} = roleApi;
