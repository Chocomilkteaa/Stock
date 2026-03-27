import { describe, expect, it } from "vitest";
import parseDailyPricesFromTwse from "./parseDailyPricesFromTwse";

describe("parseDailyPricesFromTwse", () => {
  it("should parse the target table into array of objects", () => {
    const mockData = {
      stat: "OK",
      tables: [
        {
          title: "mock title",
          fields: ["field1", "field2"],
          data: [["value1", "<p>value2</p>"]],
        },
      ],
    };

    const result = parseDailyPricesFromTwse(mockData, "mock title");

    expect(result).toEqual([
      {
        field1: "value1",
        field2: "value2",
      },
    ]);
  });

  it("should fill missing values with empty strings", () => {
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

    const result = parseDailyPricesFromTwse(mockData, "mock title");

    expect(result).toEqual([
      {
        field1: "value1",
        field2: "value2",
        field3: "",
      },
    ]);
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
    ).toThrow("API error! No table found with title: non-existent title");
  });

  it("should throw if tables is not an array", () => {
    const mockData = {
      stat: "OK",
      tables: "invalid tables",
    };

    expect(() =>
      parseDailyPricesFromTwse(mockData, "mock title"),
    ).toThrow("API error! No tables available");
  })

  it("should throw if stat is not OK", () => {
    const mockData = {
      stat: "ERROR",
      tables: [],
    };

    expect(() => parseDailyPricesFromTwse(mockData, "mock title")).toThrow(
      "API error! Stat: ERROR",
    );
  });

  it("should throw if data is not an object", () => {
    expect(() => parseDailyPricesFromTwse(null, "mock title")).toThrow(
      "API error! No data available",
    );
    expect(() =>
      parseDailyPricesFromTwse("invalid data", "mock title"),
    ).toThrow("API error! No data available");
  });
});
