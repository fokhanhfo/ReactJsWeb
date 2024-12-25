import categoryApi from "api/categoryApi";
import { useEffect, useState } from "react";

export default function useListCategory(){
    const [categorys , setCategorys] = useState([]);
    const [loading,setLoading] = useState(true);
    useEffect(()=>{
        const fetchListCategory = async () => {
            try {
                setLoading(true);
                const result = await categoryApi.getAll();
                setCategorys(result.data);
            } catch (error) {
                console.error("Error fetching category details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchListCategory();
    },[]);

    return { categorys, loading };
}