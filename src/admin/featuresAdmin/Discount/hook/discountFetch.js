
import discountApi from "api/discountApi";
import { useEffect, useState, useCallback } from "react";

export default function useListDiscount() {
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hàm refetch để tải lại danh sách quyền
    const refetch = useCallback(async () => {
        try {
            setLoading(true);
            const result = await discountApi.getAll();
            setDiscounts(result.data);
        } catch (error) {
            console.error("Error fetching discount details:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { discounts, loading, refetch };
}
