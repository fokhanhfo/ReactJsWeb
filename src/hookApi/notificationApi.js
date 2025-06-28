import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "api/baseQuery";
import StorageKeys from "constants/storage-keys";
export const notificationApi = createApi({
    reducerPath:'notificationApi',
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
        getNotification : builder.query({
            query:(params)=>{
                const queryParams = { ...params, page: params.page - 1 };
                return {
                    url: '/notification',
                    method: 'GET',
                    params: queryParams
                }
            },
            providesTags:(result)=>
              result ? [{ type: 'Notification', id: 'LIST' }] : [{ type: 'Notification', id: 'LIST' }],
        }),
        addToNotification: builder.mutation({
            query: (newItem) => ({
              url: 'product/notification',
              method: 'POST',
              body: newItem,
            }),
            invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
        }),
        updateNotification: builder.mutation({
            query: (updatedItem) => ({
                url: `product/notification/${updatedItem.id}`,
                method: 'PUT',
                body: updatedItem,
            }),
            invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
        }),
        deletenotification : builder.mutation({
            query:(id) => ({
                url: `product/notification/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
        }),
        clearNotification: builder.mutation({  // Đổi tên thành clearNotification
            queryFn: () => ({ data: null }), // Không cần request, chỉ cần xóa state
            invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
        }),
    }),
});

export const { useGetNotificationQuery,useAddToNotificationMutation,useUpdateNotificationMutation,useDeletenotificationMutation,useClearNotificationMutation} = notificationApi;
