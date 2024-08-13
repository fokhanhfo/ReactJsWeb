import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const token = 'eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiIiLCJzdWIiOiJqb2huZG9lNCIsImV4cCI6MTcyNTI3MTQ1NywiaWF0IjoxNzIyNjc5NDU3LCJqdGkiOiI3NTdiYjNkYy0xOTU4LTQyNjItYjg4Zi04NDEyNzViZjA5YjIiLCJzY29wZSI6IlJPTEVfVVNFUiBBUFBST1ZFX1BPU1QifQ.cQaWG9Li8OI7l60wJEirCsu-adveot6DBD6KPb1xYfYQnr4C8UcN5Pl8nrMuVrZykowW9KnU5DcFNz8tImhjfA'
export const cartApi = createApi({
    reducerPath:'cartApi',
    baseQuery : fetchBaseQuery({
        baseUrl:"http://localhost:8080",
        prepareHeaders: (headers) => {
            if (token) {
              headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
          },
    }),
    endpoints: (builder)=>({
        getCart : builder.query({
            query:()=>"cart",
            providesTags:(result)=>
              result ? [{ type: 'Cart', id: 'LIST' }] : [{ type: 'Cart', id: 'LIST' }],
        }),
        addToCart: builder.mutation({
            query: (newItem) => ({
              url: 'cart',
              method: 'POST',
              body: newItem,
            }),
            invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
        }),
        updateCart: builder.mutation({
            query: (updatedItem) => ({
                url: `cart/${updatedItem.id}`,
                method: 'PUT',
                body: updatedItem,
            }),
            invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
        }),
        deletecart : builder.mutation({
            query:(id) => ({
                url: `cart/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
        }),
    }),
});

export const { useGetCartQuery,useAddToCartMutation,useUpdateCartMutation,useDeletecartMutation   } = cartApi;
