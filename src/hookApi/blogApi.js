import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "api/baseQuery";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Blog"],
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: () => "blogs",
      providesTags: (result) =>
        result
          ? [{ type: "Blog", id: "LIST" }]
          : [{ type: "Blog", id: "LIST" }],
    }),
    addBlog: builder.mutation({
      query: (newBlog) => ({
        url: "blogs",
        method: "POST",
        body: newBlog,
      }),
      invalidatesTags: [{ type: "Blog", id: "LIST" }],
    }),
    updateBlog: builder.mutation({
      query: (updatedBlog) => ({
        url: `blogs/${updatedBlog.id}`,
        method: "PUT",
        body: updatedBlog,
      }),
      invalidatesTags: [{ type: "Blog", id: "LIST" }],
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Blog", id: "LIST" }],
    }),
    clearBlog: builder.mutation({
      queryFn: () => ({ data: null }), // không gọi request, chỉ xoá state
      invalidatesTags: [{ type: "Blog", id: "LIST" }],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useClearBlogMutation,
} = blogApi;
