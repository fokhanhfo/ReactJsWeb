import permissionApi from "api/permission";
import roleApi from "api/roleApi";
import { useEffect, useState } from "react";

export default function useListPermission(){
    const [permissions , setPermissions] = useState([]);
    const [roles , setRoles] = useState([]);
    const [loading,setLoading] = useState(true);
    useEffect(()=>{
        const fetchListPermission = async () => {
            try {
                setLoading(true);
                const result = await permissionApi.getAll();
                const resultRoles = await roleApi.getAll();
                setRoles(resultRoles.data);
                setPermissions(result.data);
            } catch (error) {
                console.error("Error fetching permission details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchListPermission();
    },[]);

    return {roles, permissions, loading };
}