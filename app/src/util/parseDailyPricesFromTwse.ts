const DailyPriceTableTitle = "每日收盤行情(全部(不含權證、牛熊證))"

function getTargetTable(
  data: object,
  targetTitle: string,
): {
  title: string;
  fields: string[];
  data: string[][];
} {
  if (!("tables" in data) || !Array.isArray(data.tables)) {
    throw new Error("API error! No tables available");
  }

  const targetTable: {
    title: string;
    fields: string[];
    data: string[][];
  } | undefined = data.tables.find((table: unknown) => {
    if (!table || typeof table !== "object") return false;
    return (
      "title" in table &&
      typeof table.title === "string" &&
      table.title.includes(targetTitle) &&
      "fields" in table &&
      Array.isArray(table.fields) &&
      table.fields.every((field: unknown) => typeof field === "string") &&
      "data" in table &&
      Array.isArray(table.data) &&
      table.data.every(
        (row) =>
          Array.isArray(row) && row.every((cell) => typeof cell === "string"),
      )
    );
  });

  if (!targetTable) {
    throw new Error(`API error! No table found with title: ${targetTitle}`);
  }

  return targetTable;
}

function normalizeCell(value: string | undefined): string {
  return value ? value.replace(/<[^>]*>/g, '').trim() : "";
}

function parseTableData(table: {
  title: string;
  fields: string[];
  data: string[][];
}): Array<Record<string, string>> {
    const parsedData = table.data.map((row) => {
        const record: Record<string, string> = {};
        table.fields.forEach((field, index) => {
            record[field] = normalizeCell(row[index]);
        });
        return record;
    });
    return parsedData;
}

function parseDailyPricesFromTwse(data: unknown, targetTableTitle: string = DailyPriceTableTitle): Array<Record<string, string>> {
  if (!data || typeof data !== "object")
    throw new Error("API error! No data available");

  if ("stat" in data && data.stat !== "OK") {
    throw new Error(`API error! Stat: ${data.stat}`);
  }

  const targetTable = getTargetTable(data, targetTableTitle);
  return parseTableData(targetTable);
}

export default parseDailyPricesFromTwse;
