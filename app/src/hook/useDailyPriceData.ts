import { useState } from "react";
import dayjs from "dayjs";
import fetchDailyPricesFromTwse from "../api/fetchDailyPricesFromTwse";
import parseDailyPricesFromTwse from "../util/parseDailyPricesFromTwse";
import fetchDailyPricesFromTpex from "../api/fetchDailyPricesFromTpex";
import parseDailyPricesFromTpex from "../util/parseDailyPricesFromTpex";

function useDailyPriceData() {
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());

    const [dailyPriceData, setDailyPriceData] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    const [error, setError] = useState<string | null>(null);

    const [isCompleted, setIsCompleted] = useState<boolean>(false);

    const handleChangeDate = (newValue: dayjs.Dayjs | null) => {
        if (newValue) {
            setSelectedDate(newValue);
        }
    }

    const getDailyPriceData = async () => {
        setLoading(true);
        setError(null);
        setIsCompleted(false);

        try {
            const dataFromTwse = await fetchDailyPricesFromTwse(selectedDate.format("YYYYMMDD"))
            const parsedDataFromTwse = parseDailyPricesFromTwse(dataFromTwse);

            const dataFromTpex = await fetchDailyPricesFromTpex(selectedDate.format("YYYY-MM-DD"))
            const parsedDataFromTpex = parseDailyPricesFromTpex(dataFromTpex);

            setDailyPriceData(JSON.stringify(parsedDataFromTwse.concat(parsedDataFromTpex), null, 2));
        } catch (error) {
            setError(error instanceof Error ? error.message : String(error));
            setDailyPriceData('');
        } finally {
            setLoading(false);
            setIsCompleted(true);
        }
    }

    const downloadDailyPriceData = async () => {
        if (!dailyPriceData) return;

        const blob = new Blob([dailyPriceData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `twse_daily_price_${selectedDate.format("YYYYMMDD")}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    return {
        selectedDate,
        handleChangeDate,
        dailyPriceData,
        setDailyPriceData,
        getDailyPriceData,
        loading,
        error,
        isCompleted,
        downloadDailyPriceData,
    }
}

export default useDailyPriceData;