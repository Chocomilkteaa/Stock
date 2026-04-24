/**
 * @vitest-environment node
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import fetchMonthlyRevenueFromTwse from "./fetchMonthlyRevenueFromTwse";
import fetchData from "./api.util";
import dayjs from "dayjs";

vi.mock("./api.util", () => ({
    default: vi.fn(),
}));

describe("fetchMonthlyRevenueFromTwse", () => {
    const date = dayjs("2024-01-01");
    
    beforeEach(() => {
        vi.mocked(fetchData).mockReset();
    })

    it("should fetch data for type sii", async () => {
        const mockText = `<html></html>`;

        vi.mocked(fetchData).mockResolvedValue(mockText);

        const result = await fetchMonthlyRevenueFromTwse(date);

        expect(fetchData).toHaveBeenCalledExactlyOnceWith(`https://mopsov.twse.com.tw/nas/t21/sii/t21sc03_113_1.csv`, 'text');
        expect(result).toEqual(mockText);
    });

    it("should throw if response is not ok for type sii", async () => {
        vi.mocked(fetchData).mockRejectedValue(new Error("HTTP error: 500 Internal Server Error"));

        await expect(fetchMonthlyRevenueFromTwse(date)).rejects.toThrow(
            "TWSE SII HTTP error: 500 Internal Server Error"
        );
    });

    it("should fetch data for type otc", async () => {
        const mockText = `<html></html>`;

        vi.mocked(fetchData).mockResolvedValue(mockText);

        const result = await fetchMonthlyRevenueFromTwse(date, "otc");

        expect(fetchData).toHaveBeenCalledExactlyOnceWith(`https://mopsov.twse.com.tw/nas/t21/otc/t21sc03_113_1.csv`, 'text');
        expect(result).toEqual(mockText);
    });

    it("should throw if response is not ok for type otc", async () => {
        vi.mocked(fetchData).mockRejectedValue(new Error("HTTP error: 500 Internal Server Error"));

        await expect(fetchMonthlyRevenueFromTwse(date, "otc")).rejects.toThrow(
            "TWSE OTC HTTP error: 500 Internal Server Error"
        );
    });
});
