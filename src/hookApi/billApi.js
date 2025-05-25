import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "api/baseQuery";
import StorageKeys from "constants/storage-keys";
export const billApi = createApi({
    reducerPath:'billApi',
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
        getBill: builder.query({
            query: (params) => {
                const page = params.page ? params.page - 1 : 0;
                const queryString = new URLSearchParams({ ...params, page }).toString();
                return `bill?${queryString}`;
            },
            providesTags: (result) =>
                result ? [{ type: 'Bill', id: 'LIST' }] : [{ type: 'Bill', id: 'LIST' }],
        }),
        getBillById: builder.query({
            query: (id) => `bill/${id}`,
            providesTags: (result, error, id) => [{ type: 'Bill', id }],
        }),
        addToBill: builder.mutation({
            query: (newItem) => ({
              url: 'bill',
              method: 'POST',
              body: newItem,
            }),
            invalidatesTags: [{ type: 'Bill', id: 'LIST' }],
        }),
        updateBill: builder.mutation({
            query: (updatedItem) => ({
                url: `bill/${updatedItem.id}`,
                method: 'PUT',
                body: updatedItem,
            }),
            invalidatesTags: [{ type: 'Bill', id: 'LIST' }],
        }),
        deletebill : builder.mutation({
            query:(id) => ({
                url: `bill/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Bill', id: 'LIST' }],
        }),
        updateStatusBill: builder.mutation({
            query: (updatedItem) => ({
                url: `bill/${updatedItem.id}`,
                method: 'PUT',
                body: updatedItem,
            }),
            invalidatesTags: (result, error, updatedItem) => [
                { type: 'Bill', id: updatedItem.id },
                { type: 'Bill', id: 'LIST' },
            ],
        }),
        clearBill: builder.mutation({  // Đổi tên thành clearBill
            queryFn: () => ({ data: null }), // Không cần request, chỉ cần xóa state
            invalidatesTags: [{ type: 'Bill', id: 'LIST' }],
        }),
    }),
});

export const { 
    useGetBillQuery,
    useAddToBillMutation,
    useUpdateBillMutation,
    useDeletebillMutation,
    useUpdateStatusBillMutation,
    useClearBillMutation,
    useGetBillByIdQuery
} = billApi;
