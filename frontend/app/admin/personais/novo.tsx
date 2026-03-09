import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import { Button } from "components/button";
import {
	ErrorMessage,
	Field,
	FieldGroup,
	Fieldset,
	Label,
} from "components/fieldset";
import { Heading } from "components/heading";
import { Input } from "components/input";
import { Text } from "components/text";
import { Form, redirect, useNavigation } from "react-router";
import type { ApiErrors, Personal } from "~/data/types";
import { ValidationError, api } from "~/lib/api";
import type { Route } from "./+types/novo";

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	const data = {
		nome: formData.get("nome"),
		email: formData.get("email"),
		password: formData.get("password"),
		telefone: formData.get("telefone"),
		cref: formData.get("cref") || undefined,
	};

	try {
		const personal = await api.post<Personal>("/api/admin/personais", data);
		return redirect(`/admin/personais/${personal.id}`);
	} catch (err) {
		if (err instanceof ValidationError) {
			return { errors: err.errors };
		}
		throw err;
	}
}

export default function NovoPersonal({ actionData }: Route.ComponentProps) {
	const navigation = useNavigation();
	const submitting = navigation.state === "submitting";
	const errors: ApiErrors = actionData?.errors ?? {};

	return (
		<>
			<div className="mb-6">
				<Button plain href="/admin/personais">
					<ChevronLeftIcon />
					Voltar
				</Button>
			</div>

			<Heading>Novo Personal</Heading>
			<Text className="mt-2">
				Preencha os dados para cadastrar um novo personal trainer.
			</Text>

			<Form method="post" className="mt-8 max-w-lg">
				<Fieldset>
					<FieldGroup>
						<Field>
							<Label>Nome</Label>
							<Input name="nome" placeholder="Nome completo" />
							{errors.nome && <ErrorMessage>{errors.nome[0]}</ErrorMessage>}
						</Field>
						<Field>
							<Label>Email</Label>
							<Input
								name="email"
								type="email"
								placeholder="email@exemplo.com"
							/>
							{errors.email && <ErrorMessage>{errors.email[0]}</ErrorMessage>}
						</Field>
						<Field>
							<Label>Senha</Label>
							<Input
								name="password"
								type="password"
								placeholder="Senha de acesso"
							/>
							{errors.password && (
								<ErrorMessage>{errors.password[0]}</ErrorMessage>
							)}
						</Field>
						<Field>
							<Label>Telefone</Label>
							<Input name="telefone" placeholder="(00) 00000-0000" />
							{errors.telefone && (
								<ErrorMessage>{errors.telefone[0]}</ErrorMessage>
							)}
						</Field>
						<Field>
							<Label>CREF (opcional)</Label>
							<Input name="cref" placeholder="000000-G/UF" />
							{errors.cref && <ErrorMessage>{errors.cref[0]}</ErrorMessage>}
						</Field>
					</FieldGroup>
				</Fieldset>

				<div className="mt-8 flex gap-4">
					<Button type="submit" disabled={submitting}>
						{submitting ? "Cadastrando..." : "Cadastrar"}
					</Button>
					<Button plain href="/admin/personais">
						Cancelar
					</Button>
				</div>
			</Form>
		</>
	);
}
