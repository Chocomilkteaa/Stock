import { describe, expect, it } from "vitest";
import parseDailyPricesFromTpex from "./parseDailyPricesFromTpex";

describe("parseDailyPricesFromTpex", () => {
  it("should parse the target table into array of objects", () => {
    const mockData = {
      stat: "ok",
      tables: [
        {
          title: "mock title",
          fields: ["field1", "field2"],
          data: [["value1", "<p>value2</p>"]],
        },
      ],
    };

    const result = parseDailyPricesFromTpex(mockData, "mock title");

    expect(result).toEqual([
      {
        field1: "value1",
        field2: "value2",
      },
    ]);
  });

  it("should fill missing values with empty strings", () => {
    const mockData = {
      stat: "ok",
      tables: [
        {
          title: "mock title",
          fields: ["field1", "field2", "field3"],
          data: [["value1", "<p>value2</p>"]],
        },
      ],
    };

    const result = parseDailyPricesFromTpex(mockData, "mock title");

    expect(result).toEqual([
      {
        field1: "value1",
        field2: "value2",
        field3: "",
      },
    ]);
  });

  it("should throw if parsed data is empty", () => {
    const mockData = {
      stat: "ok",
      tables: [
        {
          title: "mock title",
          fields: ["field1", "field2"],
          data: [],
        },
      ],
    };

    expect(() =>
      parseDailyPricesFromTpex(mockData, "mock title"),
    ).toThrow("TPEX API error: No data rows available in the target table");
  });

  it("should throw if target table is not found", () => {
    const mockData = {
      stat: "ok",
      tables: [
        {
          title: "mock title",
          fields: ["field1", "field2", "field3"],
          data: [["value1", "<p>value2</p>"]],
        },
      ],
    };

    expect(() =>
      parseDailyPricesFromTpex(mockData, "non-existent title"),
    ).toThrow("TPEX API error: No table found with title: non-existent title");
  });

  it("should throw if tables is not an array", () => {
    const mockData = {
      stat: "ok",
      tables: "invalid tables",
    };

    expect(() =>
      parseDailyPricesFromTpex(mockData, "mock title"),
    ).toThrow("TPEX API error: No tables available");
  })

  it("should throw if stat is not OK", () => {
    const mockData = {
      stat: "ERROR",
      tables: [],
    };

    expect(() => parseDailyPricesFromTpex(mockData, "mock title")).toThrow(
      "TPEX API error: Stat: ERROR",
    );
  });

  it("should throw if data is not an object", () => {
    expect(() => parseDailyPricesFromTpex(null, "mock title")).toThrow(
      "TPEX API error: No data available",
    );
    expect(() =>
      parseDailyPricesFromTpex("invalid data", "mock title"),
    ).toThrow("TPEX API error: No data available");
  });
});
