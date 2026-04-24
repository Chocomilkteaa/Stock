import fetchData from "./api.util";
import type { Dayjs } from "dayjs";

const ROC_YEAR_OFFSET = 1911;

async function fetchMonthlyRevenueFromTwse(
    date: Dayjs,
    type: 'sii' | 'otc' = 'sii',
): Promise<string> {
    const year = date.year();
    const month = date.month() + 1; // month is zero-indexed in Dayjs
    const rocYear = (year - ROC_YEAR_OFFSET).toString();
    const formattedMonth = month.toString();
    const url = `https://mopsov.twse.com.tw/nas/t21/${type}/t21sc03_${rocYear}_${formattedMonth}.csv`;

    try {
        return await fetchData(url, "text");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`TWSE ${type.toUpperCase()} ${errorMessage}`);
    }
}

export default fetchMonthlyRevenueFromTwse;