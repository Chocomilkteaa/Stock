import { useState } from "react";
import dayjs from "dayjs";
import { fetchDailyPricesFromTwse } from "../api/fetchDailyPricesFromTwse";

export function useDailyPriceData() {
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());

    const [dailyPriceData, setDailyPriceData] = useState<any>(null);

    const [loading, setLoading] = useState<boolean>(false);

    const [error, setError] = useState<string | null>(null);

    const handleChangeDate = (newValue: dayjs.Dayjs | null) => {
        if (newValue) {
            setSelectedDate(newValue);
        }
    }

    const fetchDailyPriceData = async () => {
        setLoading(true);
        setError(null);

        try {
            const dateString = selectedDate.format("YYYYMMDD");
            const data = await fetchDailyPricesFromTwse(dateString)

            setDailyPriceData(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : String(error));
            setDailyPriceData(null);
        } finally {
            setLoading(false);
        }
    }

    return {
        selectedDate,
        handleChangeDate,
        dailyPriceData,
        setDailyPriceData,
        fetchDailyPriceData,
        loading,
        error,
    }
}