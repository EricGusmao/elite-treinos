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
import { Textarea } from "components/textarea";
import { Form, redirect, useNavigation } from "react-router";
import type { Aluno, ApiErrors } from "~/data/types";
import { ValidationError, api } from "~/lib/api";
import type { Route } from "./+types/novo";

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	const data = {
		nome: formData.get("nome"),
		email: formData.get("email"),
		password: formData.get("password"),
		data_nascimento: formData.get("data_nascimento") || undefined,
		observacoes: formData.get("observacoes") || undefined,
	};

	try {
		const aluno = await api.post<Aluno>("/api/personal/alunos", data);
		return redirect(`/personal/alunos/${aluno.id}`);
	} catch (err) {
		if (err instanceof ValidationError) {
			return { errors: err.errors };
		}
		throw err;
	}
}

export default function NovoAluno({ actionData }: Route.ComponentProps) {
	const navigation = useNavigation();
	const submitting = navigation.state === "submitting";
	const errors: ApiErrors = actionData?.errors ?? {};

	return (
		<>
			<div className="mb-6">
				<Button plain href="/personal/alunos">
					<ChevronLeftIcon />
					Voltar
				</Button>
			</div>

			<Heading>Novo Aluno</Heading>
			<Text className="mt-2">
				Preencha os dados para cadastrar um novo aluno.
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
								placeholder="Senha de acesso do aluno"
							/>
							{errors.password && (
								<ErrorMessage>{errors.password[0]}</ErrorMessage>
							)}
						</Field>
						<Field>
							<Label>Data de Nascimento</Label>
							<Input name="data_nascimento" type="date" />
							{errors.data_nascimento && (
								<ErrorMessage>{errors.data_nascimento[0]}</ErrorMessage>
							)}
						</Field>
						<Field>
							<Label>Observacoes (opcional)</Label>
							<Textarea
								name="observacoes"
								placeholder="Lesoes, restricoes, objetivos..."
							/>
							{errors.observacoes && (
								<ErrorMessage>{errors.observacoes[0]}</ErrorMessage>
							)}
						</Field>
					</FieldGroup>
				</Fieldset>

				<div className="mt-8 flex gap-4">
					<Button type="submit" disabled={submitting}>
						{submitting ? "Cadastrando..." : "Cadastrar"}
					</Button>
					<Button plain href="/personal/alunos">
						Cancelar
					</Button>
				</div>
			</Form>
		</>
	);
}
