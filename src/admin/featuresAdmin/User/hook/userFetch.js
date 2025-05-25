import userApi from "api/userApi";
import { useEffect, useState } from "react";

export default function useListUser(){
    const [users , setUsers] = useState([]);
    const [loading,setLoading] = useState(true);
    useEffect(()=>{
        const fetchListCategory = async () => {
            try {
                setLoading(true);
                const result = await userApi.getAll();
                setUsers(result.data);
            } catch (error) {
                console.error("Error fetching category details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchListCategory();
    },[]);

    return { users, loading };
}