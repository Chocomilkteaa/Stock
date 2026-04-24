const MonthlyRevenueTargetFields = [
    "公司代號",
    "公司名稱",
    "營業收入-當月營收",
    "營業收入-上月營收",
    "營業收入-去年當月營收",
    "營業收入-上月比較增減(%)",
    "營業收入-去年同月增減(%)",
    "累計營業收入-當月累計營收",
    "累計營業收入-去年累計營收",
    "累計營業收入-前期比較增減(%)", "備註"
]
const MonthlyRevenueTargetFieldMap: Record<string, string> = {
    "公司代號": "證券代號",
    "公司名稱": "證券名稱",
    "營業收入-當月營收": "當月營收",
    "營業收入-上月營收": "上月營收",
    "營業收入-去年當月營收": "去年當月營收",
    "營業收入-上月比較增減(%)": "上月比較增減",
    "營業收入-去年同月增減(%)": "去年同月增減",
    "累計營業收入-當月累計營收": "當月累計營收",
    "累計營業收入-去年累計營收": "去年累計營收",
    "累計營業收入-前期比較增減(%)": "前期比較增減",
    "備註": "備註"
}

const ERROR_MESSAGES = {
    BASE_ERROR: "TWSE API error",
    INVALID_CSV: "Invalid CSV format",
    MISSING_FIELDS: (fields: string[]) => `Missing required fields: ${fields.join(", ")}`,
} as const;

function escapeRegex(input: string): string {
    return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getRegex(delimiter: string = ","): RegExp {
    const escapedDelimiter = escapeRegex(delimiter);
    return new RegExp(`(?<=${escapedDelimiter}|^)(?:"([^"]*(?:""[^"]*)*)"|([^${escapedDelimiter}"\\n\\r]*))(?=${escapedDelimiter}|$)`, 'g');
}

function isValidCSV(raw: unknown, delimiter: string = ","): raw is string {
    if (typeof raw !== "string" || !raw.trim()) return false;

    const lines = raw.trim().split(/\r?\n/);
    if (lines.length < 2) return false;

    const headers = lines[0].split(delimiter).map(header => header.trim());

    const regex = getRegex(delimiter);

    for (const line of lines.slice(1)) {
        const matches = line.match(regex);
        if (!matches) return false;

        if (matches.length !== headers.length) return false;
    }

    return true;
}

function validateHeaders(headers: string[]): void {
    const missingFields = MonthlyRevenueTargetFields.filter((field) => !headers.includes(field));

    if (missingFields.length > 0) {
        throw new Error(ERROR_MESSAGES.MISSING_FIELDS(missingFields));
    }
}

function normalizeCell(value: string | undefined): string {
    return value ? value.replace(/(^"|"$)/g, '').replace(/""/g, '"').trim() : "";
}

function parseCSVToJson(csv: string, delimiter: string = ","): Array<Record<string, string>> {
    const lines = csv.trim().split(/\r?\n/);

    const headers = lines[0].split(delimiter).map(header => header.trim());
    validateHeaders(headers);

    const parsedData: Array<Record<string, string>> = [];
    const regex = getRegex(delimiter);

    lines.slice(1).forEach(line => {
        const matches = line.match(regex);
        if (!matches) {
            throw new Error(ERROR_MESSAGES.INVALID_CSV);
        };
        const record: Record<string, string> = {};
        matches.forEach((match, index) => {
            const header = headers[index];
            if (MonthlyRevenueTargetFields.includes(header)) {
                record[MonthlyRevenueTargetFieldMap[header]] = normalizeCell(match);
            }
        });

        parsedData.push(record);
    });

    return parsedData;
}

function parseMonthlyRevenueFromTwse(raw: unknown): Array<Record<string, string>> {
    try {
        if (!isValidCSV(raw)) {
            throw new Error(ERROR_MESSAGES.INVALID_CSV);
        }

        return parseCSVToJson(raw);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`${ERROR_MESSAGES.BASE_ERROR}: ${errorMessage}`);
    }
}

export default parseMonthlyRevenueFromTwse;