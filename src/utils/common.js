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

export function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, nên cần +1
    const year = date.getFullYear(); // Lấy năm đầy đủ

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
}