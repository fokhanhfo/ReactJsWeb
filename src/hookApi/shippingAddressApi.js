import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "api/baseQuery";

export const shippingAddressApi = createApi({
  reducerPath: 'shippingAddressApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['ShippingAddress'],
  endpoints: (builder) => ({
    getShippingAddresses: builder.query({
      query: () => "shipping-address",
      providesTags: (result) =>
        result ? [{ type: 'ShippingAddress', id: 'LIST' }] : [{ type: 'ShippingAddress', id: 'LIST' }],
    }),
    addShippingAddress: builder.mutation({
      query: (newAddress) => ({
        url: 'shipping-address',
        method: 'POST',
        body: newAddress,
      }),
      invalidatesTags: [{ type: 'ShippingAddress', id: 'LIST' }],
    }),
    updateShippingAddress: builder.mutation({
      query: ({ id, ...updated }) => ({
        url: `shipping-address/${id}`,
        method: 'PUT',
        body: updated,
      }),
      invalidatesTags: [{ type: 'ShippingAddress', id: 'LIST' }],
    }),
    deleteShippingAddress: builder.mutation({
      query: (id) => ({
        url: `shipping-address/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'ShippingAddress', id: 'LIST' }],
    }),
    clearShippingAddress: builder.mutation({
      queryFn: () => ({ data: null }),
      invalidatesTags: [{ type: 'ShippingAddress', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetShippingAddressesQuery,
  useAddShippingAddressMutation,
  useUpdateShippingAddressMutation,
  useDeleteShippingAddressMutation,
  useClearShippingAddressMutation,
} = shippingAddressApi;
