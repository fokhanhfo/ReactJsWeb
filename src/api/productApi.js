import axios from "axios";
import axiosClient from "./axiosClient";

const productApi = {
    async getAll(params){
        const newParams = {...params};

        newParams.page -=1;
        const productList = await axiosClient.get('/shop',{params:newParams});

        return {
            data : productList.data.products,
            pagination :{
                page: params.page,
                limit: params.limit,
                count:productList.data.count,
            }
        };
    },

    async getNewProduct(params) {
        const newParams = {...params}
        newParams.page -=1;
        const productList = await axiosClient.get('/shop/newproduct',{params:newParams});
        return {
            data : productList.data,
            pagination :{
                page: params.page,
                limit: params.limit
            }
        };
    },

    get(id){
        const url = `/product/${id}`;
        return axiosClient.get(url);
    },

    async add(data){
        const url = `/product/Add`;
        if (data instanceof FormData) {
            return axiosClient.post(url, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } else {
            return axiosClient.post(url, data);
        }
    },

    update(data){
        const url = `/product/${data.id}`;
        return axiosClient.put(url,data);
    },

    remove(id){
        const url = `/products/${id}`;
        return axiosClient.delete(url);
    },


};

export default productApi;