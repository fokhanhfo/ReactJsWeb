import productApi from "api/productApi";
import { useEffect, useState } from "react";

export default function useProductDetail(productId){
    const [product , setProduct] = useState({});
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const result = await productApi.get(productId);
                setProduct(result.data);
            } catch (error) {
                console.error("Error fetching product details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);
    console.log(product);

    return { product, loading };
}