/**
 * @vitest-environment node
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import fetchData from "./api.util";

describe("fetchData", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch json data", async () => {
    const mockData = {
      stat: "ok",
      data: "test",
    };

    // @ts-expect-error - Mocking global fetch
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchData("mock-url");

    expect(globalThis.fetch).toHaveBeenCalledExactlyOnceWith("mock-url");
    expect(result).toEqual(mockData);
  });

  it("should fetch text data", async () => {
    const mockText = "test text";

    // @ts-expect-error - Mocking global fetch
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: async () => mockText,
    });

    const result = await fetchData("mock-url", "text");

    expect(globalThis.fetch).toHaveBeenCalledExactlyOnceWith("mock-url");
    expect(result).toEqual(mockText);
  });

  it("should throw if response is not ok", async () => {
    // @ts-expect-error - Mocking global fetch
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(fetchData("mock-url")).rejects.toThrow(
      "HTTP error: 500 Internal Server Error"
    );
  });
});
