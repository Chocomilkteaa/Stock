import fetchData from "./api.util";

const ROC_YEAR_OFFSET = 1911;

async function fetchMonthlyRevenueFromTwse(
    date: string,
    type: 'sii' | 'otc' = 'sii',
): Promise<string> {
    const [year, month] = date.split("-");
    const rocYear = (parseInt(year) - ROC_YEAR_OFFSET).toString();
    const formattedMonth = parseInt(month).toString();
    const url = `https://mops.twse.com.tw/nas/t21/${type}/t21sc03_${rocYear}_${formattedMonth}_0.html`;

    try {
        return await fetchData(url, "text");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`TWSE ${type.toUpperCase()} ${errorMessage}`);
    }
}

export default fetchMonthlyRevenueFromTwse;