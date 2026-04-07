/**
 * @vitest-environment node
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import fetchDailyPricesFromTwse from "./fetchDailyPricesFromTwse";
import fetchData from "./api.util";

vi.mock("./api.util", () => ({
  default: vi.fn(),
}));

describe("fetchDailyPricesFromTwse", () => {
  beforeEach(() => {
    vi.mocked(fetchData).mockReset();
  })

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

    // @ts-expect-error
    vi.mocked(fetchData).mockResolvedValue(mockData);

    const result = await fetchDailyPricesFromTwse("20240101");

    expect(fetchData).toHaveBeenCalledExactlyOnceWith(`https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?date=20240101&type=ALLBUT0999&response=json`);
    expect(result).toEqual(mockData);
  });

  it("should throw if response is not ok", async () => {
    vi.mocked(fetchData).mockRejectedValue(new Error("HTTP error: 500 Internal Server Error"));

    await expect(fetchDailyPricesFromTwse("20240101")).rejects.toThrow(
      "TWSE HTTP error: 500 Internal Server Error"
    );
  });
});
