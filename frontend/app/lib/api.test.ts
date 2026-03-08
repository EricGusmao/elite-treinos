import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api, ValidationError } from "./api";

const BASE_URL = "http://localhost:8000";

function mockFetch(status: number, body?: unknown, headers?: HeadersInit) {
	return vi.fn().mockResolvedValue({
		ok: status >= 200 && status < 300,
		status,
		headers: new Headers(headers),
		json: () => Promise.resolve(body),
	});
}

beforeEach(() => {
	document.cookie = "XSRF-TOKEN=; max-age=0";
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe("api.get", () => {
	it("sends GET request with correct headers", async () => {
		const fetchSpy = (global.fetch = mockFetch(200, { id: 1 }));

		const result = await api.get("/api/me");

		expect(fetchSpy).toHaveBeenCalledWith(`${BASE_URL}/api/me`, {
			method: "GET",
			headers: expect.objectContaining({
				Accept: "application/json",
				"Content-Type": "application/json",
			}),
			credentials: "include",
			body: undefined,
		});
		expect(result).toEqual({ id: 1 });
	});

	it("includes XSRF-TOKEN header when cookie is set", async () => {
		document.cookie = "XSRF-TOKEN=test-token-123";
		const fetchSpy = (global.fetch = mockFetch(200, {}));

		await api.get("/api/me");

		expect(fetchSpy).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				headers: expect.objectContaining({
					"X-XSRF-TOKEN": "test-token-123",
				}),
			}),
		);
	});

	it("redirects to / on 401 by default", async () => {
		global.fetch = mockFetch(401);
		const locationSpy = vi.spyOn(window, "location", "get").mockReturnValue({
			...window.location,
			href: "/admin/personais",
		});

		const hrefSetter = vi.fn();
		Object.defineProperty(window, "location", {
			get: () => ({ href: "/admin/personais" }),
			set: () => {},
			configurable: true,
		});
		Object.defineProperty(window.location, "href", {
			set: hrefSetter,
			configurable: true,
		});

		await expect(api.get("/api/users")).rejects.toThrow("Unauthorized");

		locationSpy.mockRestore();
	});

	it("does NOT redirect on 401 when skipAuthRedirect is true", async () => {
		global.fetch = mockFetch(401);

		const originalHref = window.location.href;
		await expect(
			api.get("/api/me", { skipAuthRedirect: true }),
		).rejects.toThrow("Unauthorized");
		expect(window.location.href).toBe(originalHref);
	});

	it("throws ValidationError on 422", async () => {
		const errors = { email: ["O campo email e obrigatorio."] };
		global.fetch = mockFetch(422, { errors });

		try {
			await api.get("/api/test");
			expect.unreachable("should have thrown");
		} catch (err) {
			expect(err).toBeInstanceOf(ValidationError);
			expect((err as ValidationError).errors).toEqual(errors);
		}
	});

	it("throws on other error status codes", async () => {
		global.fetch = mockFetch(500, { message: "Server error" });

		await expect(api.get("/api/test")).rejects.toThrow("Server error");
	});

	it("returns undefined for 204 No Content", async () => {
		global.fetch = mockFetch(204);

		const result = await api.get("/api/test");
		expect(result).toBeUndefined();
	});
});

describe("api.post", () => {
	it("fetches CSRF cookie before posting if not present", async () => {
		const calls: string[] = [];
		global.fetch = vi.fn().mockImplementation((url: string) => {
			calls.push(url);
			return Promise.resolve({
				ok: true,
				status: 200,
				json: () => Promise.resolve({ success: true }),
			});
		});

		await api.post("/api/login", { email: "a@b.com", password: "123" });

		expect(calls[0]).toBe(`${BASE_URL}/sanctum/csrf-cookie`);
		expect(calls[1]).toBe(`${BASE_URL}/api/login`);
	});

	it("skips CSRF fetch if cookie already exists", async () => {
		document.cookie = "XSRF-TOKEN=existing-token";
		const fetchSpy = (global.fetch = mockFetch(200, { ok: true }));

		await api.post("/api/test", { data: 1 });

		expect(fetchSpy).toHaveBeenCalledTimes(1);
		expect(fetchSpy).toHaveBeenCalledWith(
			`${BASE_URL}/api/test`,
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify({ data: 1 }),
			}),
		);
	});
});

describe("api.put", () => {
	it("sends PUT request with body", async () => {
		document.cookie = "XSRF-TOKEN=token";
		const fetchSpy = (global.fetch = mockFetch(200, { updated: true }));

		const result = await api.put("/api/users/1", { name: "New" });

		expect(fetchSpy).toHaveBeenCalledWith(
			`${BASE_URL}/api/users/1`,
			expect.objectContaining({
				method: "PUT",
				body: JSON.stringify({ name: "New" }),
			}),
		);
		expect(result).toEqual({ updated: true });
	});
});

describe("api.del", () => {
	it("sends DELETE request", async () => {
		document.cookie = "XSRF-TOKEN=token";
		global.fetch = mockFetch(204);

		const result = await api.del("/api/users/1");

		expect(result).toBeUndefined();
	});
});
