import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router";
import { AuthProvider } from "~/lib/auth";
import { ValidationError } from "~/lib/api";
import Login from "./login";

const mockNavigate = vi.fn();

vi.mock("react-router", async () => {
	const actual = await vi.importActual("react-router");
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

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

function renderLogin() {
	return render(
		<MemoryRouter>
			<AuthProvider>
				<Login />
			</AuthProvider>
		</MemoryRouter>,
	);
}

beforeEach(() => {
	mockNavigate.mockClear();
	mockGet.mockRejectedValue(new Error("Unauthorized"));
	mockPost.mockReset();
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe("Login page", () => {
	it("renders the login form", async () => {
		renderLogin();

		await waitFor(() => {
			expect(
				screen.getByRole("heading", { name: "Entrar na sua conta" }),
			).toBeInTheDocument();
		});

		expect(screen.getByLabelText("Email")).toBeInTheDocument();
		expect(screen.getByLabelText("Senha")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
	});

	it("submits credentials and navigates on success", async () => {
		mockPost.mockResolvedValue({
			id: 1,
			name: "Test",
			email: "test@test.com",
			role: "personal",
		});

		renderLogin();
		const user = userEvent.setup();

		await waitFor(() => {
			expect(screen.getByLabelText("Email")).toBeInTheDocument();
		});

		await user.type(screen.getByLabelText("Email"), "test@test.com");
		await user.type(screen.getByLabelText("Senha"), "password123");
		await user.click(screen.getByRole("button", { name: "Entrar" }));

		await waitFor(() => {
			expect(mockPost).toHaveBeenCalledWith("/api/login", {
				email: "test@test.com",
				password: "password123",
			});
		});

		expect(mockNavigate).toHaveBeenCalledWith("/personal/alunos");
	});

	it("shows generic error on non-validation failure", async () => {
		mockPost.mockRejectedValue(new Error("Network error"));

		renderLogin();
		const user = userEvent.setup();

		await waitFor(() => {
			expect(screen.getByLabelText("Email")).toBeInTheDocument();
		});

		await user.type(screen.getByLabelText("Email"), "bad@test.com");
		await user.type(screen.getByLabelText("Senha"), "wrong");
		await user.click(screen.getByRole("button", { name: "Entrar" }));

		await waitFor(() => {
			expect(
				screen.getByText("Credenciais invalidas."),
			).toBeInTheDocument();
		});
	});

	it("shows field-level errors on validation failure", async () => {
		const { ValidationError: MockValidationError } = await import("~/lib/api");
		mockPost.mockRejectedValue(
			new MockValidationError({
				email: ["O campo email e obrigatorio."],
			}),
		);

		renderLogin();
		const user = userEvent.setup();

		await waitFor(() => {
			expect(screen.getByLabelText("Email")).toBeInTheDocument();
		});

		await user.click(screen.getByRole("button", { name: "Entrar" }));

		await waitFor(() => {
			expect(
				screen.getByText("O campo email e obrigatorio."),
			).toBeInTheDocument();
		});
	});

	it("shows 'Entrando...' while submitting", async () => {
		mockPost.mockReturnValue(new Promise(() => {}));

		renderLogin();
		const user = userEvent.setup();

		await waitFor(() => {
			expect(screen.getByLabelText("Email")).toBeInTheDocument();
		});

		await user.type(screen.getByLabelText("Email"), "a@b.com");
		await user.type(screen.getByLabelText("Senha"), "123");
		await user.click(screen.getByRole("button", { name: "Entrar" }));

		await waitFor(() => {
			expect(
				screen.getByRole("button", { name: "Entrando..." }),
			).toBeDisabled();
		});
	});
});
