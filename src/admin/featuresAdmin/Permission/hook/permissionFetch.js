import permissionApi from "api/permission";
import { useEffect, useState, useCallback } from "react";

export default function useListPermission() {
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hàm refetch để tải lại danh sách quyền
    const refetch = useCallback(async () => {
        try {
            setLoading(true);
            const result = await permissionApi.getAll();
            setPermissions(result.data);
        } catch (error) {
            console.error("Error fetching permission details:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { permissions, loading, refetch };
}
