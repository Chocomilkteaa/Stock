export async function fetchDailyPricesFromTwse(
  date: string,
): Promise<any> {
  const url = `https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?date=${date}&type=ALLBUT0999&response=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  if (data.stat !== "OK") {
    throw new Error(`API error! ${data.stat}`);
  }

  return data;
}
