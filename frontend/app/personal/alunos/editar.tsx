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
import type { ApiErrors, Aluno } from "~/data/types";
import { ValidationError, api } from "~/lib/api";
import type { Route } from "./+types/editar";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const aluno = await api.get<Aluno>(`/api/alunos/${params.id}`);
	return { aluno };
}

export async function clientAction({
	request,
	params,
}: Route.ClientActionArgs) {
	const formData = await request.formData();
	const data = {
		nome: formData.get("nome"),
		email: formData.get("email"),
		data_nascimento: formData.get("data_nascimento") || undefined,
		observacoes: formData.get("observacoes") || undefined,
	};

	try {
		await api.put(`/api/alunos/${params.id}`, data);
		return redirect(`/personal/alunos/${params.id}`);
	} catch (err) {
		if (err instanceof ValidationError) {
			return { errors: err.errors };
		}
		throw err;
	}
}

export default function EditarAluno({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	const { aluno } = loaderData;
	const navigation = useNavigation();
	const submitting = navigation.state === "submitting";
	const errors: ApiErrors = actionData?.errors ?? {};

	return (
		<>
			<div className="mb-6">
				<Button plain href={`/personal/alunos/${aluno.id}`}>
					<ChevronLeftIcon />
					Voltar
				</Button>
			</div>

			<Heading>Editar Aluno</Heading>
			<Text className="mt-2">Atualize os dados de {aluno.nome}.</Text>

			<Form method="post" className="mt-8 max-w-lg">
				<Fieldset>
					<FieldGroup>
						<Field>
							<Label>Nome</Label>
							<Input name="nome" defaultValue={aluno.nome} />
							{errors.nome && <ErrorMessage>{errors.nome[0]}</ErrorMessage>}
						</Field>
						<Field>
							<Label>Email</Label>
							<Input name="email" type="email" defaultValue={aluno.email} />
							{errors.email && <ErrorMessage>{errors.email[0]}</ErrorMessage>}
						</Field>
						<Field>
							<Label>Data de Nascimento</Label>
							<Input
								name="data_nascimento"
								type="date"
								defaultValue={aluno.dataNascimento ?? ""}
							/>
							{errors.data_nascimento && (
								<ErrorMessage>{errors.data_nascimento[0]}</ErrorMessage>
							)}
						</Field>
						<Field>
							<Label>Observacoes (opcional)</Label>
							<Textarea
								name="observacoes"
								defaultValue={aluno.observacoes ?? ""}
							/>
							{errors.observacoes && (
								<ErrorMessage>{errors.observacoes[0]}</ErrorMessage>
							)}
						</Field>
					</FieldGroup>
				</Fieldset>

				<div className="mt-8 flex gap-4">
					<Button type="submit" disabled={submitting}>
						{submitting ? "Salvando..." : "Salvar"}
					</Button>
					<Button plain href={`/personal/alunos/${aluno.id}`}>
						Cancelar
					</Button>
				</div>
			</Form>
		</>
	);
}
