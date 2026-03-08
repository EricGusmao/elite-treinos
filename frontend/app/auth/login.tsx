import { AuthLayout } from "components/auth-layout";
import { Button } from "components/button";
import { ErrorMessage, Field, Label } from "components/fieldset";
import { Heading } from "components/heading";
import { Input } from "components/input";
import { useState } from "react";
import { useAuth } from "~/lib/auth";
import { ValidationError } from "~/lib/api";
import type { ApiErrors } from "~/data/types";

export default function Login() {
	const { login } = useAuth();
	const [error, setError] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<ApiErrors>({});
	const [submitting, setSubmitting] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setFieldErrors({});
		setSubmitting(true);

		const form = new FormData(e.currentTarget);
		const email = form.get("email") as string;
		const password = form.get("password") as string;

		try {
			await login(email, password);
		} catch (err) {
			if (err instanceof ValidationError) {
				setFieldErrors(err.errors);
			} else {
				setError("Credenciais invalidas.");
			}
			setSubmitting(false);
		}
	}

	return (
		<AuthLayout>
			<form
				onSubmit={handleSubmit}
				className="grid w-full max-w-sm grid-cols-1 gap-8"
			>
				<Heading>Entrar na sua conta</Heading>

				{error && (
					<p className="text-sm text-red-600 dark:text-red-500">{error}</p>
				)}

				<Field>
					<Label>Email</Label>
					<Input type="email" name="email" />
					{fieldErrors.email && (
						<ErrorMessage>{fieldErrors.email[0]}</ErrorMessage>
					)}
				</Field>
				<Field>
					<Label>Senha</Label>
					<Input type="password" name="password" />
					{fieldErrors.password && (
						<ErrorMessage>{fieldErrors.password[0]}</ErrorMessage>
					)}
				</Field>
				<Button type="submit" disabled={submitting}>
					{submitting ? "Entrando..." : "Entrar"}
				</Button>
			</form>
		</AuthLayout>
	);
}
