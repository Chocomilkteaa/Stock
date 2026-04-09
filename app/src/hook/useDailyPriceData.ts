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
            const twseDate = selectedDate.format("YYYYMMDD");
            const tpexDate = selectedDate.format("YYYY-MM-DD");
            const [dataFromTwse, dataFromTpex] = await Promise.all([
                fetchDailyPricesFromTwse(twseDate),
                fetchDailyPricesFromTpex(tpexDate),
            ]);

            const parsedDataFromTwse = parseDailyPricesFromTwse(dataFromTwse);
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

        const parsedData = JSON.parse(dailyPriceData);

        const headers = Object.keys(parsedData[0]);
        const headerRow = headers.join(",") + "\n";
        const dataRows = parsedData.map((row: Record<string, string>) =>
            headers.map((header) => JSON.stringify(row[header])).join(",")
        ).join("\n");
        const csvContent = headerRow + dataRows;

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `daily_price_${selectedDate.format("YYYYMMDD")}.csv`;
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