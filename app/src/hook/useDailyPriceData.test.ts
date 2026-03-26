import { describe, expect, it, vi } from "vitest";
import { renderHook, act } from '@testing-library/react';
import { useDailyPriceData } from "./useDailyPriceData";
import { fetchDailyPricesFromTwse } from "../api/fetchDailyPricesFromTwse";

vi.mock("../api/fetchDailyPricesFromTwse", () => ({
    fetchDailyPricesFromTwse: vi.fn(),
}));

describe("useDailyPriceData", () => {
    it("should initialize with default values", () => {
        const {result} = renderHook(() => useDailyPriceData());

        expect(result.current.selectedDate).toBeDefined();
        expect(result.current.dailyPriceData).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    })

    it("should update selectedDate when handleChangeDate is called", () => {
        const {result} = renderHook(() => useDailyPriceData());
        const newDate = result.current.selectedDate.add(1, 'day');

        act(() => {
            result.current.handleChangeDate(newDate);
        });

        expect(result.current.selectedDate).toEqual(newDate);
    })

    it("should update states when fetch daily price data succeeds", async () => {
        const mockData = {
            data: 'test'
        };

        vi.mocked(fetchDailyPricesFromTwse).mockResolvedValue(mockData);

        const {result} = renderHook(() => useDailyPriceData());

        await act(async () => {
            await result.current.fetchDailyPriceData();
        });

        expect(result.current.dailyPriceData).toEqual(mockData);
        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBe(false);
    })

        it("should handle errors when fetching daily price data fails", async () => {
        const mockError = new Error("Failed to fetch");

        vi.mocked(fetchDailyPricesFromTwse).mockRejectedValue(mockError);

        const {result} = renderHook(() => useDailyPriceData());

        await act(async () => {
            await result.current.fetchDailyPriceData();
        });

        expect(result.current.dailyPriceData).toBeNull();
        expect(result.current.error).toEqual(mockError.message);
        expect(result.current.loading).toBe(false);
    })
})