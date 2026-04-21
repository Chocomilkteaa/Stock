const MonthlyRevenueTargetFields = [
    "公司代號",
    "公司名稱",
    "營業收入 - 當月營收",
    "營業收入 - 上月營收",
    "營業收入 - 去年當月營收",
    "營業收入 - 上月比較增減(%)",
    "營業收入 - 去年同月增減(%)",
    "累計營業收入 - 當月累計營收",
    "累計營業收入 - 去年累計營收",
    "累計營業收入 - 前期比較增減(%)", "備註"
]
const MonthlyRevenueTargetFieldMap: Record<string, string> = {
    代號: "公司代號",
    名稱: "公司名稱",
    當月營收: "營業收入 - 當月營收",
    上月營收: "營業收入 - 上月營收",
    去年當月營收: "營業收入 - 去年當月營收",
    上月比較增減: "營業收入 - 上月比較增減(%)",
    去年同月增減: "營業收入 - 去年同月增減(%)",
    當月累計營收: "累計營業收入 - 當月累計營收",
    去年累計營收: "累計營業收入 - 去年累計營收",
    前期比較增減: "累計營業收入 - 前期比較增減(%)",
    備註: "備註"
}

function isValidCSV(raw: unknown, delimiter: string = ","): raw is string {
    if (typeof raw !== "string" || !raw.trim()) return false;

    const lines = raw.trim().split(/\r?\n/);

    let columnCount: number | null = null;

    for (const line of lines) {
        const regex = new RegExp(`(?<=${delimiter}|^)(?:"([^"]*(?:""[^"]*)*)"|([^${delimiter}"\\n\\r]*))(?=${delimiter}|$)`, 'g');
        const matches = line.match(regex);
        if (!matches) return false;

        const currentColumnCount = matches.length;

        if (columnCount === null) {
            columnCount = currentColumnCount;
        } else if (currentColumnCount !== columnCount) {
            return false;
        }
    }

    return true;
}

function normalizeCell(value: string | undefined): string {
  return value ? value.replace(/(^"|"$)/g, '').replace(/""/g, '"').trim() : "";
}

function parseCSVToJson(csv: string, delimiter: string = ","): Array<Record<string, string>> {
    const lines = csv.trim().split(/\r?\n/);

    const headers = lines[0].split(delimiter).map(header => header.trim());

    const parsedData: Array<Record<string, string>> = [];

    lines.slice(1).map(line => {
        const regex = new RegExp(`(?<=${delimiter}|^)(?:"([^"]*(?:""[^"]*)*)"|([^${delimiter}"\\n\\r]*))(?=${delimiter}|$)`, 'g');
        const matches = line.match(regex);
        if (!matches) {
            throw new Error("Invalid CSV format");
        };
        const record: Record<string, string> = {};
        matches.forEach((match, index) => {
            if (MonthlyRevenueTargetFields.includes(headers[index])) {
                record[MonthlyRevenueTargetFieldMap[headers[index]]] = normalizeCell(match);
            }
        });

        parsedData.push(record);
    });

    return parsedData;
}

function parseMonthlyRevenueFromTwse(raw: unknown): Array<Record<string, string>> {
    try {
        if (!isValidCSV(raw)) {
            throw new Error("Invalid CSV format");
        }

        return parseCSVToJson(raw);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`TWSE API error: ${errorMessage}`);
    }
}

export default parseMonthlyRevenueFromTwse;