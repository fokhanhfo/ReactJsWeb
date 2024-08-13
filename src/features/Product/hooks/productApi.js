import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import queryString from "query-string";
import { baseQueryWithAuth } from "utils";
export const productApi = createApi({
    reducerPath: 'product',
    baseQuery:baseQueryWithAuth,
    endpoints: (builder) => ({
        getProduct: builder.query({
            query: (filters) =>{
                const query = queryString.stringify(filters);
                return `product?${query}`;
            } ,
        }),
    }),
});

export const {
    useGetProductQuery,
} = productApi;
