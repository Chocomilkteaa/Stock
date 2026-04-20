/**
 * @vitest-environment node
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import fetchDailyPricesFromTpex from "./fetchDailyPricesFromTpex";
import fetchData from "./api.util";

vi.mock("./api.util", () => ({
  default: vi.fn(),
}));

describe("fetchDailyPricesFromTpex", () => {
  beforeEach(() => {
        vi.mocked(fetchData).mockReset();
    })
    
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

    // @ts-expect-error
    vi.mocked(fetchData).mockResolvedValue(mockData);

    const result = await fetchDailyPricesFromTpex("2024-01-01");

    expect(fetchData).toHaveBeenCalledExactlyOnceWith(`/tpexApi/www/zh-tw/afterTrading/dailyQuotes?date=2024%2F01%2F01&id=&response=json`);
    expect(result).toEqual(mockData);
  });

  it("should throw if response is not ok", async () => {
    vi.mocked(fetchData).mockRejectedValue(new Error("HTTP error: 500 Internal Server Error"));

    await expect(fetchDailyPricesFromTpex("2024-01-01")).rejects.toThrow(
      "TPEX HTTP error: 500 Internal Server Error"
    );
  });

  it("should throw if date format is invalid", async () => {
    await expect(fetchDailyPricesFromTpex("01-01-2024")).rejects.toThrow(
      'TPEX Request Error: Invalid date format. Expected "YYYY-MM-DD".'
    );
  });
});
