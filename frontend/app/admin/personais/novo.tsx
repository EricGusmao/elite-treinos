import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import { Button } from "components/button";
import { Field, FieldGroup, Fieldset, Label } from "components/fieldset";
import { Heading } from "components/heading";
import { Input } from "components/input";
import { Text } from "components/text";

export default function NovoPersonal() {
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

			<form className="mt-8 max-w-lg">
				<Fieldset>
					<FieldGroup>
						<Field>
							<Label>Nome</Label>
							<Input name="nome" placeholder="Nome completo" />
						</Field>
						<Field>
							<Label>Email</Label>
							<Input name="email" type="email" placeholder="email@exemplo.com" />
						</Field>
						<Field>
							<Label>Senha</Label>
							<Input name="password" type="password" placeholder="Senha de acesso" />
						</Field>
						<Field>
							<Label>Telefone</Label>
							<Input name="telefone" placeholder="(00) 00000-0000" />
						</Field>
						<Field>
							<Label>CREF (opcional)</Label>
							<Input name="cref" placeholder="000000-G/UF" />
						</Field>
					</FieldGroup>
				</Fieldset>

				<div className="mt-8 flex gap-4">
					<Button type="submit">Cadastrar</Button>
					<Button plain href="/admin/personais">
						Cancelar
					</Button>
				</div>
			</form>
		</>
	);
}
