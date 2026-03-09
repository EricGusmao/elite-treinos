import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router";
import { AuthProvider, useAuth } from "./auth";
import type { User } from "~/data/types";

const mockNavigate = vi.fn();

vi.mock("react-router", async () => {
	const actual = await vi.importActual("react-router");
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

vi.mock("./api", () => ({
	api: {
		get: vi.fn(),
		post: vi.fn(),
	},
}));

import { api } from "./api";

const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);

function TestConsumer() {
	const { user, loading, login, logout } = useAuth();

	if (loading) return <div>Loading...</div>;

	return (
		<div>
			<div data-testid="user">{user ? user.name : "null"}</div>
			<button type="button" onClick={() => login("test@test.com", "password")}>
				Login
			</button>
			<button type="button" onClick={() => logout()}>
				Logout
			</button>
		</div>
	);
}

function renderWithAuth() {
	return render(
		<MemoryRouter>
			<AuthProvider>
				<TestConsumer />
			</AuthProvider>
		</MemoryRouter>,
	);
}

const personalUser: User = {
	id: 1,
	name: "Personal",
	email: "personal@test.com",
	role: "personal",
};

beforeEach(() => {
	mockNavigate.mockClear();
	mockGet.mockReset();
	mockPost.mockReset();
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe("AuthProvider", () => {
	it("shows loading state initially", () => {
		mockGet.mockReturnValue(new Promise(() => {}));
		renderWithAuth();

		expect(screen.getByText("Loading...")).toBeInTheDocument();
	});

	it("fetches user on mount with skipAuthRedirect", async () => {
		mockGet.mockResolvedValue(personalUser);
		renderWithAuth();

		await waitFor(() => {
			expect(screen.getByTestId("user")).toHaveTextContent("Personal");
		});

		expect(mockGet).toHaveBeenCalledWith("/api/me", {
			skipAuthRedirect: true,
		});
	});

	it("sets user to null when /api/me fails", async () => {
		mockGet.mockRejectedValue(new Error("Unauthorized"));
		renderWithAuth();

		await waitFor(() => {
			expect(screen.getByTestId("user")).toHaveTextContent("null");
		});
	});

	it("login sets user and navigates to personal route", async () => {
		mockGet.mockRejectedValue(new Error("Unauthorized"));
		mockPost.mockResolvedValue(personalUser);

		renderWithAuth();

		await waitFor(() => {
			expect(screen.getByTestId("user")).toHaveTextContent("null");
		});

		const user = userEvent.setup();
		await user.click(screen.getByText("Login"));

		await waitFor(() => {
			expect(screen.getByTestId("user")).toHaveTextContent("Personal");
		});

		expect(mockPost).toHaveBeenCalledWith("/api/login", {
			email: "test@test.com",
			password: "password",
		});
		expect(mockNavigate).toHaveBeenCalledWith("/personal/alunos");
	});

	it("login navigates to /admin/personais for superadmin", async () => {
		const admin: User = { ...personalUser, role: "superadmin", name: "Admin" };
		mockGet.mockRejectedValue(new Error("Unauthorized"));
		mockPost.mockResolvedValue(admin);

		renderWithAuth();
		await waitFor(() =>
			expect(screen.getByTestId("user")).toHaveTextContent("null"),
		);

		const user = userEvent.setup();
		await user.click(screen.getByText("Login"));

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith("/admin/personais");
		});
	});

	it("login navigates to /aluno/treinos for aluno", async () => {
		const aluno: User = { ...personalUser, role: "aluno", name: "Aluno" };
		mockGet.mockRejectedValue(new Error("Unauthorized"));
		mockPost.mockResolvedValue(aluno);

		renderWithAuth();
		await waitFor(() =>
			expect(screen.getByTestId("user")).toHaveTextContent("null"),
		);

		const user = userEvent.setup();
		await user.click(screen.getByText("Login"));

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith("/aluno/treinos");
		});
	});

	it("logout clears user and navigates to /", async () => {
		mockGet.mockResolvedValue(personalUser);
		mockPost.mockResolvedValue(undefined);

		renderWithAuth();
		await waitFor(() =>
			expect(screen.getByTestId("user")).toHaveTextContent("Personal"),
		);

		const user = userEvent.setup();
		await user.click(screen.getByText("Logout"));

		await waitFor(() => {
			expect(screen.getByTestId("user")).toHaveTextContent("null");
		});

		expect(mockPost).toHaveBeenCalledWith("/api/logout");
		expect(mockNavigate).toHaveBeenCalledWith("/");
	});
});

describe("useAuth", () => {
	it("throws when used outside AuthProvider", () => {
		const spy = vi.spyOn(console, "error").mockImplementation(() => {});

		expect(() =>
			render(
				<MemoryRouter>
					<TestConsumer />
				</MemoryRouter>,
			),
		).toThrow("useAuth must be used within AuthProvider");

		spy.mockRestore();
	});
});
