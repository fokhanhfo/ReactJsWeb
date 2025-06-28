import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "api/baseQuery";
import StorageKeys from "constants/storage-keys";
export const productApi = createApi({
    reducerPath:'productApi',
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
        getProducts:builder.query({
            query:(params)=>{
                const queryParams = { ...params, page: params.page - 1 };
                return {
                    url: 'product',
                    method: 'GET',
                    params: queryParams
                }
            },
            providesTags: (result) =>
                result ? [{ type: 'Product', id: 'LIST' }] : [{ type: 'Product', id: 'LIST' }],
        }),
        addProduct: builder.mutation({
            query: (newProduct) => {
                const isFormData = newProduct instanceof FormData;
                return {
                    url: "product",
                    method: "POST",
                    body: newProduct,
                    formData: isFormData,
                };
            },
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),
        updateProduct: builder.mutation({
            query: (Product) => {
                return {
                    url: "product",
                    method: "PUT",
                    body: Product,
                };
            },
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),
        getAllProductStatistics: builder.query({
            query: () => ({
                url: 'product/getAllProductStatistics',
                method: 'GET',
            }),
            providesTags: (result) =>
                result ? [{ type: 'Product', id: 'LIST' }] : [{ type: 'Product', id: 'LIST' }],
            }),

        }),
});

export const {
    useGetProductsQuery,
    useAddProductMutation,
    useUpdateProductMutation,
    useGetAllProductStatisticsQuery,
} = productApi;
