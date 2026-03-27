import { describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useDailyPriceData from "./useDailyPriceData";
import fetchDailyPricesFromTwse from "../api/fetchDailyPricesFromTwse";
import parseDailyPricesFromTwse from "../util/parseDailyPricesFromTwse";

vi.mock("../api/fetchDailyPricesFromTwse", () => ({
  default: vi.fn(),
}));

vi.mock("../util/parseDailyPricesFromTwse", () => ({
  default: vi.fn(),
}));

describe("useDailyPriceData", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() => useDailyPriceData());

    expect(result.current.selectedDate).toBeDefined();
    expect(result.current.dailyPriceData).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should update selectedDate when handleChangeDate is called", () => {
    const { result } = renderHook(() => useDailyPriceData());
    const newDate = result.current.selectedDate.add(1, "day");

    act(() => {
      result.current.handleChangeDate(newDate);
    });

    expect(result.current.selectedDate).toEqual(newDate);
  });

  it("should update states when fetch daily price data succeeds", async () => {
    const mockData = {
      data: "test",
    };

    vi.mocked(fetchDailyPricesFromTwse).mockResolvedValue(mockData);
    vi.mocked(parseDailyPricesFromTwse).mockReturnValue([mockData]);

    const { result } = renderHook(() => useDailyPriceData());

    await act(async () => {
      await result.current.getDailyPriceData();
    });

    expect(result.current.dailyPriceData).toEqual(JSON.stringify([mockData], null, 2));
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("should handle errors when fetching daily price data fails", async () => {
    const mockError = new Error("Failed to fetch");

    vi.mocked(fetchDailyPricesFromTwse).mockRejectedValue(mockError);

    const { result } = renderHook(() => useDailyPriceData());

    await act(async () => {
      await result.current.getDailyPriceData();
    });

    expect(result.current.dailyPriceData).toBe('');
    expect(result.current.error).toEqual(mockError.message);
    expect(result.current.loading).toBe(false);
  });

  it("should create a downloadable file when downloadDailyPriceData is called", async () => {
    const mockData = {
      date: "2023-01-01",
      data: "test",
    };
    const mockUrl = "mock-url";

    const createObjectURLMock = vi.fn((blob) => `${mockUrl}-${blob.size}`);
    const revokeObjectURLMock = vi.fn();

    globalThis.URL.createObjectURL = createObjectURLMock;
    globalThis.URL.revokeObjectURL = revokeObjectURLMock;

    const linkSpy = vi.spyOn(document, "createElement")
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    const { result } = renderHook(() => useDailyPriceData());

    act(() => {
      result.current.setDailyPriceData(JSON.stringify(mockData, null, 2));
    });
    act(() => {
      result.current.downloadDailyPriceData();
    });

    const blobCall = createObjectURLMock.mock.calls[0][0];
    expect(blobCall).toBeInstanceOf(Blob);
    expect(blobCall.type).toBe("application/json");
    const blobText = await blobCall.text();
    expect(JSON.parse(blobText)).toEqual(mockData);

    const lastCreatedElement = linkSpy.mock.results.find(
      (res) => res.value.tagName === "A",
    )?.value;
    const expectedFileName = `twse_daily_price_${result.current.selectedDate.format("YYYYMMDD")}.json`;
    expect(lastCreatedElement.download).toBe(expectedFileName);

    expect(clickSpy).toHaveBeenCalled();

    linkSpy.mockRestore();
    clickSpy.mockRestore();
  });
});
