import axiosClient from "./axiosClient";
const token = localStorage.getItem('access_token');

const billApi = {
    async getAll(params){
        const newParams = {...params};

        newParams.page -=1;
        const billList = await axiosClient.get('/bill',{params:newParams});

        return {
            data : billList.data.bill,
            pagination :{
                page: params.page,
                limit: params.limit,
                count:billList.data.count,
            }
        };
    },
    async getAllTest(params){
        const newParams = {...params};

        newParams.page -=1;
        const billList = await axiosClient.get('/bill',{params:newParams});

        return {
            data : billList.data.bill,
            pagination :{
                page: params.page,
                limit: params.limit,
                count:billList.data.count,
            }
        };
    },
    updateStatus(data){
        const url = `/bill/${data.id}`;
        return axiosClient.put(url,{status:data.status});
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
        const url = `/bill/${id}`;
        return axiosClient.get(url);
    },

    add(data){
        const url = `/bill`;
        return axiosClient.post(url,data,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
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

export default billApi;