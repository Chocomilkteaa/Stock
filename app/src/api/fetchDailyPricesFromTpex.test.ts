import { describe, expect, it, vi } from "vitest";
import fetchDailyPricesFromTpex from "./fetchDailyPricesFromTpex";

describe("fetchDailyPricesFromTpex", () => {
  it("should fetch data", async () => {
    const mockData = {
      stat: "ok",
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

    const result = await fetchDailyPricesFromTpex("2024-01-01");

    expect(globalThis.fetch).toHaveBeenCalledExactlyOnceWith(`/tpexApi/www/zh-tw/afterTrading/dailyQuotes?date=2024%2F01%2F01&id=&response=json`);
    expect(result).toEqual(mockData);
  });

  it("should throw if response is not ok", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(fetchDailyPricesFromTpex("2024-01-01")).rejects.toThrow(
      "HTTP error! 500 Internal Server Error"
    );
  });
});
