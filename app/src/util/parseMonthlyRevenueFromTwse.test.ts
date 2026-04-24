import { describe, expect, it } from "vitest";
import parseMonthlyRevenueFromTwse from "./parseMonthlyRevenueFromTwse";

describe("parseMonthlyRevenueFromTwse", () => {
    const fullHeader =
    "出表日期,資料年月,公司代號,公司名稱,產業別,營業收入-當月營收,營業收入-上月營收,營業收入-去年當月營收,營業收入-上月比較增減(%),營業收入-去年同月增減(%),累計營業收入-當月累計營收,累計營業收入-去年累計營收,累計營業收入-前期比較增減(%),備註";
    it("should parse valid CSV data with target fields", () => {
        const mockValue = `${fullHeader}
"115/04/23","114/4","1101","台泥","水泥工業","12681318","13635386","11626493","-6.997000304941862","9.072598246091921","47653544","37312156","27.715868254838988","-"
"115/04/23","114/4","1102","亞泥","水泥工業","6276269","6532662","5686606","-3.9247859448414752","10.36933102099917","22870976","22186438","3.085389371651276","-"`;

        const result = parseMonthlyRevenueFromTwse(mockValue);

        const expectedResult = [
            {
                證券代號: "1101",
                證券名稱: "台泥",
                當月營收: "12681318",
                上月營收: "13635386",
                去年當月營收: "11626493",
                上月比較增減: "-6.997000304941862",
                去年同月增減: "9.072598246091921",
                當月累計營收: "47653544",
                去年累計營收: "37312156",
                前期比較增減: "27.715868254838988",
                備註: "-"
            },
            {
                證券代號: "1102",
                證券名稱: "亞泥",
                當月營收: "6276269",
                上月營收: "6532662",
                去年當月營收: "5686606",
                上月比較增減: "-3.9247859448414752",
                去年同月增減: "10.36933102099917",
                當月累計營收: "22870976",
                去年累計營收: "22186438",
                前期比較增減: "3.085389371651276",
                備註: "-"
            }
        ];

        expect(result).toEqual(expectedResult);
    });

    it("should throw when required header fields are missing", () => {
        const missingRemarkHeader =
            fullHeader.replace(",備註", "")

        const mockValue = `${missingRemarkHeader}
"115/04/23","114/4","1101","台泥","水泥工業","12681318","13635386","11626493","-6.997000304941862","9.072598246091921","47653544","37312156","27.715868254838988"`;

        expect(() => parseMonthlyRevenueFromTwse(mockValue)).toThrow(
            "TWSE API error: Missing required fields: 備註",
        );
    });

    it("should throw if any row has missing fields", () => {
        const mockValue = `${fullHeader}
"115/04/23","114/4","1101","台泥","水泥工業","12681318","13635386","11626493","-6.997000304941862","9.072598246091921","47653544","37312156","27.715868254838988"
"115/04/23","114/4","1102","亞泥","水泥工業","6276269","6532662","5686606","-3.9247859448414752","10.36933102099917","22870976","22186438","3.085389371651276","-"`;

        expect(() => parseMonthlyRevenueFromTwse(mockValue)).toThrow("TWSE API error: Invalid CSV format");
    });

    it("should throw when all data rows have the same but wrong column count", () => {
        const mockValue = `${fullHeader}
"115/04/23","114/4","1101","台泥","水泥工業","12681318","13635386","11626493","-6.997000304941862","9.072598246091921","47653544","37312156","27.715868254838988"
"115/04/23","114/4","1102","亞泥","水泥工業","6276269","6532662","5686606","-3.9247859448414752","10.36933102099917","22870976","22186438","3.085389371651276"`;

        expect(() => parseMonthlyRevenueFromTwse(mockValue)).toThrow(
            "TWSE API error: Invalid CSV format",
        );
    });

    it.each([
        null,
        undefined,
        "",
        "   ",
        "Not a CSV",
    ])("should throw when input is not a valid CSV string", (invalidInput) => {
        expect(() => parseMonthlyRevenueFromTwse(invalidInput)).toThrow(
            "TWSE API error: Invalid CSV format",
        );
    });

    it("should handle quoted commas and escaped quotes in cells", () => {
    const mockValue = `${fullHeader}
"115/04/23","114/4","1101","台泥,特別股","水泥工業","12681318","13635386","11626493","-6.99","9.07","47653544","37312156","27.71","He said ""OK"""`;

    const result = parseMonthlyRevenueFromTwse(mockValue);

    expect(result).toEqual([
      {
        證券代號: "1101",
        證券名稱: "台泥,特別股",
        當月營收: "12681318",
        上月營收: "13635386",
        去年當月營收: "11626493",
        上月比較增減: "-6.99",
        去年同月增減: "9.07",
        當月累計營收: "47653544",
        去年累計營收: "37312156",
        前期比較增減: "27.71",
        備註: 'He said "OK"',
      },
    ]);
  });
});