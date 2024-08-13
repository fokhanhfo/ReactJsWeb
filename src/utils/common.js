import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export function formatPrice(price){
    return new Intl.NumberFormat('vi-VN',{
        style: 'currency',
        currency: 'VND', 
     }).format(price)
}

const token = 'eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiIiLCJzdWIiOiJqb2huZG9lNCIsImV4cCI6MTcyNTI3MTQ1NywiaWF0IjoxNzIyNjc5NDU3LCJqdGkiOiI3NTdiYjNkYy0xOTU4LTQyNjItYjg4Zi04NDEyNzViZjA5YjIiLCJzY29wZSI6IlJPTEVfVVNFUiBBUFBST1ZFX1BPU1QifQ.cQaWG9Li8OI7l60wJEirCsu-adveot6DBD6KPb1xYfYQnr4C8UcN5Pl8nrMuVrZykowW9KnU5DcFNz8tImhjfA';
export const baseQueryWithAuth = fetchBaseQuery({
    baseUrl: "http://localhost:8080",
    prepareHeaders: (headers) => {
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });