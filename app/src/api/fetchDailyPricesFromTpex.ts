import fetchData from "./api.util";

async function fetchDailyPricesFromTpex(
  date: string,
): Promise<unknown> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('TPEX Request Error: Invalid date format. Expected "YYYY-MM-DD".');
  }

  const [year, month, day] = date.split("-");
  const url = `/tpexApi/www/zh-tw/afterTrading/dailyQuotes?date=${year}%2F${month}%2F${day}&id=&response=json`;

  try {
    return await fetchData(url);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`TPEX ${errorMessage}`);
  }
}

export default fetchDailyPricesFromTpex;