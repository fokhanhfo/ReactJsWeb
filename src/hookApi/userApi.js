import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "api/baseQuery";
import StorageKeys from "constants/storage-keys";
export const userApi = createApi({
    reducerPath:'userApi',
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
        getUsers:builder.query({
            query:(params)=>{
                console.log(params)
                const queryParams = { ...params, page: params.page - 1 };
                return {
                    url: 'user',
                    method: 'GET',
                    params: queryParams
                }
            },
            providesTags: (result) =>
                result ? [{ type: 'User', id: 'LIST' }] : [{ type: 'User', id: 'LIST' }],
        }),
        getMyInfo: builder.query({
  query: () => ({
    url: 'user/myInfo',
    method: 'GET',
  }),
  providesTags: () => [{ type: 'User', id: 'LIST' }],
}),

        addUser: builder.mutation({
            query: (newUser) => {
                const isFormData = newUser instanceof FormData;
                return {
                    url: "user/add",
                    method: "POST",
                    body: newUser,
                    formData: isFormData,
                };
            },
            invalidatesTags: [{ type: 'User', id: 'LIST' }],
        }),
        updateUser: builder.mutation({
            query: (User) => {
                return {
                    url: "user",
                    method: "PUT",
                    body: User,
                    formData: User instanceof FormData,
                };
            },
            invalidatesTags: [{ type: 'User', id: 'LIST' }],
        }),
        requestChangePassword: builder.mutation({
            query: (query) => ({
                url: 'user/change-password',
                method: 'POST',
                body: query,
            }),
        }),
        verifyOtpChangePassword: builder.mutation({
            query: (query) => ({
                url: 'user/confirm-change-password',
                method: 'POST',
                body: query
            }),
        }),
        forgotPassword: builder.mutation({
                query: ({ email }) => ({
                url: 'user/forgot-password',
                method: 'POST',
                body: { email },
                }),
            }),
            confirmForgotPassword: builder.mutation({
                query: ({ email, newPassword,confirmPassword, otp }) => ({
                url: 'user/confirm-forgot-password',
                method: 'POST',
                body: { email, newPassword,confirmPassword, otp },
                }),
            }),



    }),
});

export const {
    useGetUsersQuery,
    useGetMyInfoQuery,
    useAddUserMutation,
    useUpdateUserMutation,
    useRequestChangePasswordMutation,
    useVerifyOtpChangePasswordMutation,
    useForgotPasswordMutation,
    useConfirmForgotPasswordMutation,
} = userApi;
