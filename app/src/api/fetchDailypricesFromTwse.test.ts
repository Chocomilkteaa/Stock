import { describe, expect, it, vi } from "vitest";
import fetchDailyPricesFromTwse from "./fetchDailyPricesFromTwse";

describe("fetchDailypricesFromTwse", () => {
  it("should fetch data", async () => {
    const mockData = {
      stat: "OK",
      date: "20240101",
      tables: [
        {
          title: "mock title",
          fields: [
            "field1",
            "field2",
          ],
          data: [
            [
              "value1",
              "value2",
            ],
          ],
        },
      ],
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchDailyPricesFromTwse("20240101");

    expect(globalThis.fetch).toHaveBeenCalledExactlyOnceWith(`https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?date=20240101&type=ALLBUT0999&response=json`);
    expect(result).toEqual(mockData);
  });

  it("should throw if response is not ok", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(fetchDailyPricesFromTwse("20240101")).rejects.toThrow(
      "HTTP error! 500 Internal Server Error"
    );
  });

  it("should throw if data.stat is not 'OK'", async () => {
    const mockData = {
      stat: "ERROR",
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    await expect(fetchDailyPricesFromTwse("20240101")).rejects.toThrow(
      "API error! ERROR"
    );
  });
});
