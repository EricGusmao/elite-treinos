import { AuthLayout } from "components/auth-layout";
import { Button } from "components/button";
import { ErrorMessage, Field, Label } from "components/fieldset";
import { Heading } from "components/heading";
import { Input } from "components/input";
import { Form, useNavigation } from "react-router";
import type { ApiErrors, User } from "~/data/types";
import { ValidationError, api } from "~/lib/api";
import { roleRedirect } from "~/lib/auth-utils";
import type { Route } from "./+types/login";

export async function clientLoader() {
	try {
		const user = await api.get<User>("/api/me", { skipAuthRedirect: true });
		return roleRedirect(user);
	} catch {
		return {};
	}
}

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	try {
		const user = await api.post<User>("/api/login", {
			email: formData.get("email"),
			password: formData.get("password"),
		});
		return roleRedirect(user);
	} catch (err) {
		if (err instanceof ValidationError) {
			return { fieldErrors: err.errors };
		}
		return { error: "Credenciais invalidas." };
	}
}

export default function Login({ actionData }: Route.ComponentProps) {
	const navigation = useNavigation();
	const submitting = navigation.state === "submitting";
	const error =
		actionData && "error" in actionData ? (actionData.error as string) : null;
	const fieldErrors: ApiErrors =
		actionData && "fieldErrors" in actionData
			? (actionData.fieldErrors as ApiErrors)
			: {};

	return (
		<AuthLayout>
			<Form method="post" className="grid w-full max-w-sm grid-cols-1 gap-8">
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
			</Form>
		</AuthLayout>
	);
}
