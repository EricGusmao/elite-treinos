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
import type { Route } from "./+types/editar";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const personal = await api.get<Personal>(`/api/admin/personais/${params.id}`);
	return { personal };
}

export async function clientAction({
	request,
	params,
}: Route.ClientActionArgs) {
	const formData = await request.formData();
	const data = {
		nome: formData.get("nome"),
		email: formData.get("email"),
		telefone: formData.get("telefone"),
		cref: formData.get("cref") || undefined,
	};

	try {
		await api.put(`/api/admin/personais/${params.id}`, data);
		return redirect(`/admin/personais/${params.id}`);
	} catch (err) {
		if (err instanceof ValidationError) {
			return { errors: err.errors };
		}
		throw err;
	}
}

export default function EditarPersonal({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	const { personal } = loaderData;
	const navigation = useNavigation();
	const submitting = navigation.state === "submitting";
	const errors: ApiErrors = actionData?.errors ?? {};

	return (
		<>
			<div className="mb-6">
				<Button plain href={`/admin/personais/${personal.id}`}>
					<ChevronLeftIcon />
					Voltar
				</Button>
			</div>

			<Heading>Editar Personal</Heading>
			<Text className="mt-2">Atualize os dados de {personal.nome}.</Text>

			<Form method="post" className="mt-8 max-w-lg">
				<Fieldset>
					<FieldGroup>
						<Field>
							<Label>Nome</Label>
							<Input name="nome" defaultValue={personal.nome} />
							{errors.nome && <ErrorMessage>{errors.nome[0]}</ErrorMessage>}
						</Field>
						<Field>
							<Label>Email</Label>
							<Input name="email" type="email" defaultValue={personal.email} />
							{errors.email && <ErrorMessage>{errors.email[0]}</ErrorMessage>}
						</Field>
						<Field>
							<Label>Telefone</Label>
							<Input name="telefone" defaultValue={personal.telefone ?? ""} />
							{errors.telefone && (
								<ErrorMessage>{errors.telefone[0]}</ErrorMessage>
							)}
						</Field>
						<Field>
							<Label>CREF (opcional)</Label>
							<Input name="cref" defaultValue={personal.cref ?? ""} />
							{errors.cref && <ErrorMessage>{errors.cref[0]}</ErrorMessage>}
						</Field>
					</FieldGroup>
				</Fieldset>

				<div className="mt-8 flex gap-4">
					<Button type="submit" disabled={submitting}>
						{submitting ? "Salvando..." : "Salvar"}
					</Button>
					<Button plain href={`/admin/personais/${personal.id}`}>
						Cancelar
					</Button>
				</div>
			</Form>
		</>
	);
}
