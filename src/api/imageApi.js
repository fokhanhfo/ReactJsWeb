import axiosClient from "./axiosClient";

const imageApi = {

    getImageProduct(id){
        const url = `/image/product/${id}`;
        return axiosClient.get(url);
    },

    add(id,data){
        const url = `/image/product/${id}`;
        return axiosClient.post(url,data,{
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    update(id,data){
        const url = `/image/${id}`;
        return axiosClient.put(url,data,{
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    remove(id){
        const url = `/image/${id}`;
        return axiosClient.delete(url);
    },


};

export default imageApi;