import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import { Button } from "components/button";
import { Field, FieldGroup, Fieldset, Label } from "components/fieldset";
import { Heading } from "components/heading";
import { Input } from "components/input";
import { Text } from "components/text";
import { Textarea } from "components/textarea";
import { data } from "react-router";
import { alunos } from "~/data/mock";
import type { Route } from "./+types/editar";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const aluno = alunos.find((a) => a.id === params.id);
	if (!aluno) {
		throw data("Aluno nao encontrado", { status: 404 });
	}
	return { aluno };
}

export default function EditarAluno({ loaderData }: Route.ComponentProps) {
	const { aluno } = loaderData;

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

			<form className="mt-8 max-w-lg">
				<Fieldset>
					<FieldGroup>
						<Field>
							<Label>Nome</Label>
							<Input name="nome" defaultValue={aluno.nome} />
						</Field>
						<Field>
							<Label>Email</Label>
							<Input name="email" type="email" defaultValue={aluno.email} />
						</Field>
						<Field>
							<Label>Data de Nascimento</Label>
							<Input
								name="dataNascimento"
								type="date"
								defaultValue={aluno.dataNascimento}
							/>
						</Field>
						<Field>
							<Label>Observacoes (opcional)</Label>
							<Textarea
								name="observacoes"
								defaultValue={aluno.observacoes ?? ""}
							/>
						</Field>
					</FieldGroup>
				</Fieldset>

				<div className="mt-8 flex gap-4">
					<Button type="submit">Salvar</Button>
					<Button plain href={`/personal/alunos/${aluno.id}`}>
						Cancelar
					</Button>
				</div>
			</form>
		</>
	);
}
