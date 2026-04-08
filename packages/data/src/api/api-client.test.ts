import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiGet, apiPost, apiPut, apiDelete } from "./api-client";

const BASE_URL = "http://localhost:3000";
const TOKEN = "my-test-token";

function mockFetch(status: number = 200, body: unknown = null) {
  return vi.fn().mockImplementation(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      statusText: status === 200 ? "OK" : "Error",
      json: () => Promise.resolve(body)
    })
  ) as unknown as typeof global.fetch;
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("api-client", () => {
  describe("apiGet", () => {
    it("sends GET with Authorization header", async () => {
      global.fetch = mockFetch(200, [{ id: "1" }]);
      await apiGet(BASE_URL, "/api/tasks", TOKEN);
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/tasks`,
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Authorization: `Bearer ${TOKEN}`
          })
        })
      );
    });

    it("normalizes trailing slash in baseUrl", async () => {
      global.fetch = mockFetch(200, []);
      await apiGet(`${BASE_URL}/`, "/api/tasks", TOKEN);
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/tasks`,
        expect.any(Object)
      );
    });
  });

  describe("apiPost", () => {
    it("sends POST with body and Authorization header", async () => {
      global.fetch = mockFetch(201, { id: "1", title: "Test" });
      await apiPost(BASE_URL, "/api/tasks", { title: "Test" }, TOKEN);
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/tasks`,
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json"
          }),
          body: JSON.stringify({ title: "Test" })
        })
      );
    });
  });

  describe("apiPut", () => {
    it("sends PUT with body and Authorization header", async () => {
      global.fetch = mockFetch(200, { id: "1", title: "Updated" });
      await apiPut(
        BASE_URL,
        "/api/tasks/1",
        { id: "1", title: "Updated" },
        TOKEN
      );
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/tasks/1`,
        expect.objectContaining({
          method: "PUT",
          headers: expect.objectContaining({
            Authorization: `Bearer ${TOKEN}`
          }),
          body: JSON.stringify({ id: "1", title: "Updated" })
        })
      );
    });
  });

  describe("apiDelete", () => {
    it("sends DELETE with Authorization header", async () => {
      global.fetch = mockFetch(204, null);
      await apiDelete(BASE_URL, "/api/tasks/1", TOKEN);
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/tasks/1`,
        expect.objectContaining({
          method: "DELETE",
          headers: expect.objectContaining({
            Authorization: `Bearer ${TOKEN}`
          })
        })
      );
    });
  });

  describe("fetchWithRetry", () => {
    it("retries on failure", async () => {
      const fetchMock = vi
        .fn()
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve([])
        }) as unknown as typeof global.fetch;
      global.fetch = fetchMock;

      await apiGet(BASE_URL, "/api/tasks", TOKEN);
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("throws after max retries", async () => {
      const fetchMock = vi
        .fn()
        .mockRejectedValue(
          new Error("Network error")
        ) as unknown as typeof global.fetch;
      global.fetch = fetchMock;

      await expect(apiGet(BASE_URL, "/api/tasks", TOKEN)).rejects.toThrow(
        "Network error"
      );
      expect(fetchMock).toHaveBeenCalledTimes(2); // initial + 1 retry
    });
  });
});
