import type { ApiErrors } from "~/data/types";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export class ValidationError extends Error {
	errors: ApiErrors;
	constructor(errors: ApiErrors) {
		super("Validation failed");
		this.errors = errors;
	}
}

function getCookie(name: string): string | undefined {
	const match = document.cookie.match(new RegExp(`(^|;\\s*)${name}=([^;]*)`));
	return match ? decodeURIComponent(match[2]) : undefined;
}

async function request<T>(
	method: string,
	path: string,
	body?: unknown,
): Promise<T> {
	const headers: Record<string, string> = {
		Accept: "application/json",
		"Content-Type": "application/json",
	};

	const xsrf = getCookie("XSRF-TOKEN");
	if (xsrf) {
		headers["X-XSRF-TOKEN"] = xsrf;
	}

	const res = await fetch(`${BASE_URL}${path}`, {
		method,
		headers,
		credentials: "include",
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});

	if (res.status === 401) {
		window.location.href = "/";
		throw new Error("Unauthorized");
	}

	if (res.status === 422) {
		const json = await res.json();
		throw new ValidationError(json.errors);
	}

	if (!res.ok) {
		const json = await res.json().catch(() => ({}));
		throw new Error(json.message || `Request failed: ${res.status}`);
	}

	if (res.status === 204) {
		return undefined as T;
	}

	return res.json();
}

async function ensureCsrf(): Promise<void> {
	if (!getCookie("XSRF-TOKEN")) {
		await fetch(`${BASE_URL}/sanctum/csrf-cookie`, {
			credentials: "include",
		});
	}
}

export const api = {
	get<T>(path: string): Promise<T> {
		return request<T>("GET", path);
	},
	async post<T>(path: string, data?: unknown): Promise<T> {
		await ensureCsrf();
		return request<T>("POST", path, data);
	},
	async put<T>(path: string, data?: unknown): Promise<T> {
		await ensureCsrf();
		return request<T>("PUT", path, data);
	},
	async del(path: string): Promise<void> {
		await ensureCsrf();
		return request<void>("DELETE", path);
	},
};
