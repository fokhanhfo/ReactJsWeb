import productApi from "api/productApi";
import { useEffect, useState } from "react";

export default function useProductDetail(productId){
    const [product , setProduct] = useState({});
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        (async()=>{
            try{
                setLoading(true);
                const result = await productApi.get(productId);
                setProduct(result);
            }catch(e){
                console.log("lỗi",e);
            }
            setLoading(false);
        })()
    },[productId])

    return { product, loading };
}