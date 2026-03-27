async function fetchDailyPricesFromTpex(
  date: string,
): Promise<unknown> {
  const [year, month, day] = date.split("-");
  const url = `/tpexApi/www/zh-tw/afterTrading/dailyQuotes?date=${year}%2F${month}%2F${day}&id=&response=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TPEX HTTP error! ${response.status} ${response.statusText}`);
  }
  const data = await response.json();

  return data;
}

export default fetchDailyPricesFromTpex;