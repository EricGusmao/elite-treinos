import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "~/data/types";

vi.mock("~/lib/api", () => ({
	api: {
		get: vi.fn(),
		post: vi.fn(),
	},
	ValidationError: class ValidationError extends Error {
		errors: Record<string, string[]>;
		constructor(errors: Record<string, string[]>) {
			super("Validation failed");
			this.errors = errors;
		}
	},
}));

import { api } from "~/lib/api";

const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);

const personalUser: User = {
	id: 1,
	name: "Personal",
	email: "personal@test.com",
	role: "personal",
};

beforeEach(() => {
	mockGet.mockReset();
	mockPost.mockReset();
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe("clientLoader", () => {
	it("returns empty object when user is not authenticated", async () => {
		mockGet.mockRejectedValue(new Error("Unauthorized"));
		const { clientLoader } = await import("./login");

		const result = await clientLoader();

		expect(result).toEqual({});
	});

	it("redirects authenticated user to their role home", async () => {
		mockGet.mockResolvedValue(personalUser);
		const { clientLoader } = await import("./login");

		const result = await clientLoader();

		expect(result).toBeInstanceOf(Response);
		expect((result as Response).headers.get("Location")).toBe(
			"/personal/alunos",
		);
	});
});

describe("clientAction", () => {
	it("redirects to role home on successful login", async () => {
		mockPost.mockResolvedValue(personalUser);
		const { clientAction } = await import("./login");

		const formData = new FormData();
		formData.set("email", "test@test.com");
		formData.set("password", "password123");

		const result = await clientAction({
			request: new Request("http://localhost/", {
				method: "POST",
				body: formData,
			}),
			params: {},
		} as never);

		expect(mockPost).toHaveBeenCalledWith("/api/login", {
			email: "test@test.com",
			password: "password123",
		});
		expect(result).toBeInstanceOf(Response);
		expect((result as Response).headers.get("Location")).toBe(
			"/personal/alunos",
		);
	});

	it("redirects superadmin to /admin/personais", async () => {
		mockPost.mockResolvedValue({ ...personalUser, role: "superadmin" });
		const { clientAction } = await import("./login");

		const formData = new FormData();
		formData.set("email", "admin@test.com");
		formData.set("password", "pass");

		const result = await clientAction({
			request: new Request("http://localhost/", {
				method: "POST",
				body: formData,
			}),
			params: {},
		} as never);

		expect((result as Response).headers.get("Location")).toBe(
			"/admin/personais",
		);
	});

	it("redirects aluno to /aluno/treinos", async () => {
		mockPost.mockResolvedValue({ ...personalUser, role: "aluno" });
		const { clientAction } = await import("./login");

		const formData = new FormData();
		formData.set("email", "aluno@test.com");
		formData.set("password", "pass");

		const result = await clientAction({
			request: new Request("http://localhost/", {
				method: "POST",
				body: formData,
			}),
			params: {},
		} as never);

		expect((result as Response).headers.get("Location")).toBe("/aluno/treinos");
	});

	it("returns field errors on validation failure", async () => {
		const { ValidationError: MockValidationError } = await import("~/lib/api");
		mockPost.mockRejectedValue(
			new MockValidationError({
				email: ["O campo email e obrigatorio."],
			}),
		);
		const { clientAction } = await import("./login");

		const formData = new FormData();
		const result = await clientAction({
			request: new Request("http://localhost/", {
				method: "POST",
				body: formData,
			}),
			params: {},
		} as never);

		expect(result).toEqual({
			fieldErrors: { email: ["O campo email e obrigatorio."] },
		});
	});

	it("returns generic error on non-validation failure", async () => {
		mockPost.mockRejectedValue(new Error("Network error"));
		const { clientAction } = await import("./login");

		const formData = new FormData();
		formData.set("email", "bad@test.com");
		formData.set("password", "wrong");

		const result = await clientAction({
			request: new Request("http://localhost/", {
				method: "POST",
				body: formData,
			}),
			params: {},
		} as never);

		expect(result).toEqual({ error: "Credenciais invalidas." });
	});
});
