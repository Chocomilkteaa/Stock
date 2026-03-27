import fetchData from "./api.util";

async function fetchDailyPricesFromTwse(
  date: string,
): Promise<unknown> {
  const url = `https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?date=${date}&type=ALLBUT0999&response=json`;

  try {
    return await fetchData(url);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`TWSE ${errorMessage}`);
  }
}

export default fetchDailyPricesFromTwse;