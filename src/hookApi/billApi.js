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
        getBillStatistics:builder.query({
            query: () => ({
                url: 'bill/getBillStatistics',
                method: 'GET',
            }),
            providesTags: (result) =>
                result ? [{ type: 'Bill', id: 'LIST' }] : [{ type: 'Bill', id: 'LIST' }],
        }),
        getBillStatisticsDashboard:builder.query({
            query: (year) => ({
                url: `bill/statistic/${year}`,
                method: 'GET',
            }),
            providesTags: (result) =>
                result ? [{ type: 'Bill', id: 'LIST' }] : [{ type: 'Bill', id: 'LIST' }],
        }),
        getRevenueByCategory: builder.query({
            query: ({ year }) => ({
                url: `bill/revenue/category?year=${year}`,
                method: 'GET',
            }),
            providesTags: (result) =>
                result ? [{ type: 'Bill', id: 'LIST' }] : [{ type: 'Bill', id: 'LIST' }],
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
    useGetBillByIdQuery,
    useGetBillStatisticsQuery,
    useGetBillStatisticsDashboardQuery,
    useGetRevenueByCategoryQuery
} = billApi;


// const monthlyRevenue = [
//   { month: 'T1', revenue: 45000, orders: 120, customers: 89, avgOrder: 375 },
//   { month: 'T2', revenue: 52000, orders: 135, customers: 102, avgOrder: 385 },
//   { month: 'T3', revenue: 48000, orders: 128, customers: 95, avgOrder: 375 },
//   { month: 'T4', revenue: 61000, orders: 165, customers: 125, avgOrder: 370 },
//   { month: 'T5', revenue: 55000, orders: 142, customers: 108, avgOrder: 387 },
//   { month: 'T6', revenue: 67000, orders: 178, customers: 134, avgOrder: 376 },
//   { month: 'T7', revenue: 72000, orders: 195, customers: 148, avgOrder: 369 },
//   { month: 'T8', revenue: 68000, orders: 182, customers: 139, avgOrder: 374 },
//   { month: 'T9', revenue: 75000, orders: 203, customers: 156, avgOrder: 369 },
//   { month: 'T10', revenue: 82000, orders: 225, customers: 172, avgOrder: 364 },
//   { month: 'T11', revenue: 89000, orders: 245, customers: 189, avgOrder: 363 },
//   { month: 'T12', revenue: 95000, orders: 268, customers: 205, avgOrder: 355 },
// ];