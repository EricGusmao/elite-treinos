import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "~/data/types";

vi.mock("./api", () => ({
	api: {
		get: vi.fn(),
	},
}));

import { api } from "./api";
import { getInitials, requireRole, roleRedirect } from "./auth-utils";

const mockGet = vi.mocked(api.get);

beforeEach(() => {
	mockGet.mockReset();
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe("getInitials", () => {
	it("returns first two initials", () => {
		expect(getInitials("John Doe")).toBe("JD");
	});

	it("returns single initial for single name", () => {
		expect(getInitials("John")).toBe("J");
	});

	it("limits to 2 characters for long names", () => {
		expect(getInitials("John Michael Doe")).toBe("JM");
	});
});

describe("roleRedirect", () => {
	it("redirects superadmin to /admin/personais", () => {
		const user: User = {
			id: 1,
			name: "A",
			email: "a@b.com",
			role: "superadmin",
		};
		const result = roleRedirect(user);
		expect(result).toBeInstanceOf(Response);
		expect(result.headers.get("Location")).toBe("/admin/personais");
	});

	it("redirects personal to /personal/alunos", () => {
		const user: User = {
			id: 1,
			name: "A",
			email: "a@b.com",
			role: "personal",
		};
		const result = roleRedirect(user);
		expect(result.headers.get("Location")).toBe("/personal/alunos");
	});

	it("redirects aluno to /aluno/treinos", () => {
		const user: User = {
			id: 1,
			name: "A",
			email: "a@b.com",
			role: "aluno",
		};
		const result = roleRedirect(user);
		expect(result.headers.get("Location")).toBe("/aluno/treinos");
	});
});

describe("requireRole", () => {
	it("returns user when role matches", async () => {
		const user: User = {
			id: 1,
			name: "Admin",
			email: "a@b.com",
			role: "superadmin",
		};
		mockGet.mockResolvedValue(user);

		const result = await requireRole("superadmin");
		expect(result).toEqual(user);
		expect(mockGet).toHaveBeenCalledWith("/api/me", {
			skipAuthRedirect: true,
		});
	});

	it("throws redirect when role does not match", async () => {
		const user: User = {
			id: 1,
			name: "Personal",
			email: "a@b.com",
			role: "personal",
		};
		mockGet.mockResolvedValue(user);

		try {
			await requireRole("superadmin");
			expect.unreachable("should have thrown");
		} catch (err) {
			expect(err).toBeInstanceOf(Response);
			expect((err as Response).headers.get("Location")).toBe("/");
		}
	});

	it("throws redirect when API call fails", async () => {
		mockGet.mockRejectedValue(new Error("Unauthorized"));

		try {
			await requireRole("superadmin");
			expect.unreachable("should have thrown");
		} catch (err) {
			expect(err).toBeInstanceOf(Response);
			expect((err as Response).headers.get("Location")).toBe("/");
		}
	});
});
