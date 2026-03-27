async function fetchDailyPricesFromTwse(
  date: string,
): Promise<unknown> {
  const url = `https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?date=${date}&type=ALLBUT0999&response=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TWSE HTTP error! ${response.status} ${response.statusText}`);
  }
  const data = await response.json();

  return data;
}

export default fetchDailyPricesFromTwse;