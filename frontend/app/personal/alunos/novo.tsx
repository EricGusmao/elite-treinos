import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import { Button } from "components/button";
import { Field, FieldGroup, Fieldset, Label } from "components/fieldset";
import { Heading } from "components/heading";
import { Input } from "components/input";
import { Text } from "components/text";
import { Textarea } from "components/textarea";

export default function NovoAluno() {
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
							<Input
								name="password"
								type="password"
								placeholder="Senha de acesso do aluno"
							/>
						</Field>
						<Field>
							<Label>Data de Nascimento</Label>
							<Input name="dataNascimento" type="date" />
						</Field>
						<Field>
							<Label>Observacoes (opcional)</Label>
							<Textarea
								name="observacoes"
								placeholder="Lesoes, restricoes, objetivos..."
							/>
						</Field>
					</FieldGroup>
				</Fieldset>

				<div className="mt-8 flex gap-4">
					<Button type="submit">Cadastrar</Button>
					<Button plain href="/personal/alunos">
						Cancelar
					</Button>
				</div>
			</form>
		</>
	);
}
