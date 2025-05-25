import colorApi from "api/color";
import { useEffect, useState } from "react";

export default function useColorDetail() {
    const [color, setColor] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchColor = async () => {
        try {
            setLoading(true);
            const result = await colorApi.getAll();
            setColor(result.data);
        } catch (error) {
            console.error("Error fetching color details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchColor();
    }, []);

    return { color, loading };
}
