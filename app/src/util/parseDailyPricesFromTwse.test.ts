import { describe, expect, it } from "vitest";
import parseDailyPricesFromTwse, { DailyPriceTargetFields } from "./parseDailyPricesFromTwse";

describe("parseDailyPricesFromTwse", () => {
  it("should parse the target table into array of objects with target fields", () => {
    const mockValue = DailyPriceTargetFields.reduce((acc, _field, index) => {
      const value = index < 2 ? `<p>value${index + 1},000.0</p>` : `value${index + 1}`;
      acc.push(value);
      return acc;
    }, [] as string[]);

    const mockData = {
      stat: "OK",
      tables: [
        {
          title: "mock title",
          fields: DailyPriceTargetFields.concat(["field1", "field2"]),
          data: [mockValue.concat(["value1", "<p>value2</p>"])],
        },
      ],
    };

    const result = parseDailyPricesFromTwse(mockData, "mock title");

    const expectedResult = DailyPriceTargetFields.reduce((acc, field, index) => {
      acc[field] = index < 2 ? `value${index + 1}000.0` : `value${index + 1}`;
      return acc;
    }, {} as Record<string, string>);
    expect(result).toEqual([expectedResult]);
  });

  it("should fill missing values with empty strings", () => {
    const mockData = {
      stat: "OK",
      tables: [
        {
          title: "mock title",
          fields: DailyPriceTargetFields.concat(["field1", "field2"]),
          data: [["value1", "<p>value2</p>"]],
        },
      ],
    };

    const result = parseDailyPricesFromTwse(mockData, "mock title");

    const expectedResult = DailyPriceTargetFields.reduce((acc, field, index) => {
      acc[field] = index < 2 ? `value${index + 1}` : "";
      return acc;
    }, {} as Record<string, string>);
    expect(result).toEqual([expectedResult]);
  });

  it("should throw if target table is not found", () => {
    const mockData = {
      stat: "OK",
      tables: [
        {
          title: "mock title",
          fields: ["field1", "field2", "field3"],
          data: [["value1", "<p>value2</p>"]],
        },
      ],
    };

    expect(() =>
      parseDailyPricesFromTwse(mockData, "non-existent title"),
    ).toThrow("TWSE API error: No table found with title: non-existent title");
  });

  it("should throw if tables is not an array", () => {
    const mockData = {
      stat: "OK",
      tables: "invalid tables",
    };

    expect(() =>
      parseDailyPricesFromTwse(mockData, "mock title"),
    ).toThrow("TWSE API error: No tables available");
  })

  it("should throw if stat is not OK", () => {
    const mockData = {
      stat: "ERROR",
      tables: [],
    };

    expect(() => parseDailyPricesFromTwse(mockData, "mock title")).toThrow(
      "TWSE API error: Stat: ERROR",
    );
  });

  it("should throw if data is not an object", () => {
    expect(() => parseDailyPricesFromTwse(null, "mock title")).toThrow(
      "TWSE API error: No data available",
    );
    expect(() =>
      parseDailyPricesFromTwse("invalid data", "mock title"),
    ).toThrow("TWSE API error: No data available");
  });
});
