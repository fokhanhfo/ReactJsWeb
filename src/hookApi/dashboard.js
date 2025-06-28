import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "api/baseQuery";
import StorageKeys from "constants/storage-keys";

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    topSellingProducts: builder.query({
      query: ({ month, year }) => {
        const params = new URLSearchParams();
        if (month !== undefined) params.append("month", month);
        if (year !== undefined) params.append("year", year);

        return {
          url: `/bill-detail/top-selling-products?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result ? [{ type: "Dashboard", id: "TopSelling" }] : [],
    }),
    getStatCardDashboard: builder.query({
            query: () => ({
                url: `dashboard/getStatCardDashboard`,
                method: 'GET',
            }),
            providesTags: (result) =>
                result ? [{ type: 'Bill', id: 'LIST' }] : [{ type: 'Bill', id: 'LIST' }],
        }),
  }),
});

export const {
  useTopSellingProductsQuery,
  useGetStatCardDashboardQuery
} = dashboardApi;
