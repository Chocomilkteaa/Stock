import { DailyPriceTargetFields as TwseDailyPriceTargetFields } from "./parseDailyPricesFromTwse";

const DailyPriceTableTitle = "上櫃股票行情";
const DailyPriceTargetFields = [
  "代號",
  "名稱",
  "成交股數",
  "開盤",
  "最高",
  "最低",
  "收盤",
];
const DailyPriceTargetFieldMap: Record<string, string> = {
  代號: "證券代號",
  名稱: "證券名稱",
  成交股數: "成交股數",
  開盤: "開盤價",
  最高: "最高價",
  最低: "最低價",
  收盤: "收盤價",
};


function getTargetTable(
  data: object,
  targetTitle: string,
): {
  title: string;
  fields: string[];
  data: string[][];
} {
  if (!("tables" in data) || !Array.isArray(data.tables)) {
    throw new Error("No tables available");
  }

  const targetTable:
    | {
      title: string;
      fields: string[];
      data: string[][];
    }
    | undefined = data.tables.find((table: unknown) => {
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
    throw new Error(
      `No table found with title: ${targetTitle}`,
    );
  }

  return targetTable;
}

function normalizeCell(value: string | undefined): string {
  return value ? value.replace(/<[^>]*>/g, "").replace(/,/g, "").trim() : "";
}

function parseTableData(table: {
  title: string;
  fields: string[];
  data: string[][];
}): Array<Record<string, string>> {
  const parsedData = table.data.map((row) => {
    const record: Record<string, string> = {};
    table.fields.forEach((field, index) => {
      if (DailyPriceTargetFields.includes(field)) {
        record[DailyPriceTargetFieldMap[field]] = normalizeCell(row[index]);
      }
    });
    return record;
  });
  if (parsedData.length === 0) {
    throw new Error(
      "No data rows available in the target table",
    );
  }
  return parsedData;
}

function parseDailyPricesFromTpex(
  data: unknown,
  targetTableTitle: string = DailyPriceTableTitle,
): Array<Record<string, string>> {
  const missingTwseFields = Object.values(DailyPriceTargetFieldMap).filter(
    (field) => !TwseDailyPriceTargetFields.includes(field),
  );
  if (missingTwseFields.length > 0) {
    throw new Error(
      `Unexpected TWSE daily price fields: missing ${missingTwseFields.join(", ")}`,
    );
  }
  
  try {
    if (!data || typeof data !== "object") throw new Error("No data available");

    if ("stat" in data && data.stat !== "ok") {
      throw new Error(`Stat: ${data.stat}`);
    }

    const targetTable = getTargetTable(data, targetTableTitle);
    return parseTableData(targetTable);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`TPEX API error: ${errorMessage}`);
  }
}

export default parseDailyPricesFromTpex;
export { DailyPriceTargetFields };
