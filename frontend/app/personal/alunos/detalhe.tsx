import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import { Badge } from "components/badge";
import { Button } from "components/button";
import {
	DescriptionDetails,
	DescriptionList,
	DescriptionTerm,
} from "components/description-list";
import { Dialog, DialogActions, DialogBody, DialogTitle } from "components/dialog";
import { Field, Label } from "components/fieldset";
import { Heading, Subheading } from "components/heading";
import { Select } from "components/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "components/table";
import { Text } from "components/text";
import { useState } from "react";
import { useParams } from "react-router";
import { alunos, treinoBadgeColor, treinos } from "~/data/mock";

export default function AlunoDetalhe() {
	const { id } = useParams();
	const aluno = alunos.find((a) => a.id === id);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	if (!aluno) {
		return <Heading>Aluno nao encontrado</Heading>;
	}

	const treinosAtribuidos = treinos.filter((t) =>
		aluno.treinos.includes(t.codigo),
	);
	const limiteAtingido = aluno.treinos.length >= 2;

	return (
		<>
			<div className="mb-6">
				<Button plain href="/personal/alunos">
					<ChevronLeftIcon />
					Voltar
				</Button>
			</div>

			<div className="flex items-end justify-between gap-4">
				<Heading>{aluno.nome}</Heading>
				<div className="flex gap-2">
					<Button outline href={`/personal/alunos/${aluno.id}/editar`}>
						Editar
					</Button>
					<Button color="red">Excluir</Button>
				</div>
			</div>

			<DescriptionList className="mt-8">
				<DescriptionTerm>Nome</DescriptionTerm>
				<DescriptionDetails>{aluno.nome}</DescriptionDetails>
				<DescriptionTerm>Email</DescriptionTerm>
				<DescriptionDetails>{aluno.email}</DescriptionDetails>
				<DescriptionTerm>Data de Nascimento</DescriptionTerm>
				<DescriptionDetails>
					{new Date(aluno.dataNascimento).toLocaleDateString("pt-BR")}
				</DescriptionDetails>
				<DescriptionTerm>Observacoes</DescriptionTerm>
				<DescriptionDetails>
					{aluno.observacoes || <span className="text-zinc-400">—</span>}
				</DescriptionDetails>
			</DescriptionList>

			<div className="mt-12 flex items-end justify-between gap-4">
				<Subheading>Treinos Atribuidos</Subheading>
				<Button
					outline
					onClick={() => setIsDialogOpen(true)}
					disabled={limiteAtingido}
				>
					Atribuir Treino
				</Button>
			</div>

			{limiteAtingido && (
				<Text className="mt-2 text-amber-600">
					Limite de 2 treinos por aluno atingido.
				</Text>
			)}

			{treinosAtribuidos.length === 0 ? (
				<Text className="mt-4">Nenhum treino atribuido.</Text>
			) : (
				<Table className="mt-4">
					<TableHead>
						<TableRow>
							<TableHeader>Codigo</TableHeader>
							<TableHeader>Nome</TableHeader>
							<TableHeader>Objetivo</TableHeader>
							<TableHeader className="w-0">
								<span className="sr-only">Acoes</span>
							</TableHeader>
						</TableRow>
					</TableHead>
					<TableBody>
						{treinosAtribuidos.map((treino) => (
							<TableRow key={treino.id}>
								<TableCell>
									<Badge color={treinoBadgeColor[treino.codigo]}>
										Treino {treino.codigo}
									</Badge>
								</TableCell>
								<TableCell className="font-medium">{treino.nome}</TableCell>
								<TableCell>{treino.objetivo}</TableCell>
								<TableCell>
									<Button plain>Remover</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}

			<Dialog open={isDialogOpen} onClose={setIsDialogOpen}>
				<DialogTitle>Atribuir Treino</DialogTitle>
				<DialogBody>
					<Field>
						<Label>Selecione o treino</Label>
						<Select name="treino">
							{treinos
								.filter((t) => !aluno.treinos.includes(t.codigo))
								.map((t) => (
									<option key={t.id} value={t.codigo}>
										Treino {t.codigo} — {t.nome}
									</option>
								))}
						</Select>
					</Field>
				</DialogBody>
				<DialogActions>
					<Button plain onClick={() => setIsDialogOpen(false)}>
						Cancelar
					</Button>
					<Button onClick={() => setIsDialogOpen(false)}>Atribuir</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
