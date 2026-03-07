import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import { Button } from "components/button";
import { Field, FieldGroup, Fieldset, Label } from "components/fieldset";
import { Heading } from "components/heading";
import { Input } from "components/input";
import { Text } from "components/text";
import { useParams } from "react-router";
import { personais } from "~/data/mock";

export default function EditarPersonal() {
	const { id } = useParams();
	const personal = personais.find((p) => p.id === id);

	if (!personal) {
		return <Heading>Personal nao encontrado</Heading>;
	}

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

			<form className="mt-8 max-w-lg">
				<Fieldset>
					<FieldGroup>
						<Field>
							<Label>Nome</Label>
							<Input name="nome" defaultValue={personal.nome} />
						</Field>
						<Field>
							<Label>Email</Label>
							<Input name="email" type="email" defaultValue={personal.email} />
						</Field>
						<Field>
							<Label>Telefone</Label>
							<Input name="telefone" defaultValue={personal.telefone} />
						</Field>
						<Field>
							<Label>CREF (opcional)</Label>
							<Input name="cref" defaultValue={personal.cref ?? ""} />
						</Field>
					</FieldGroup>
				</Fieldset>

				<div className="mt-8 flex gap-4">
					<Button type="submit">Salvar</Button>
					<Button plain href={`/admin/personais/${personal.id}`}>
						Cancelar
					</Button>
				</div>
			</form>
		</>
	);
}
