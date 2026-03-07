import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import { Badge } from "components/badge";
import { Button } from "components/button";
import {
	DescriptionDetails,
	DescriptionList,
	DescriptionTerm,
} from "components/description-list";
import { Heading, Subheading } from "components/heading";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "components/table";
import { data } from "react-router";
import { alunos, personais, treinoBadgeColor } from "~/data/mock";
import type { Route } from "./+types/detalhe";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const personal = personais.find((p) => p.id === params.id);
	if (!personal) {
		throw data("Personal nao encontrado", { status: 404 });
	}
	const alunosDoPersonal = alunos.filter((a) => a.personalId === personal.id);
	return { personal, alunosDoPersonal };
}

export default function PersonalDetalhe({ loaderData }: Route.ComponentProps) {
	const { personal, alunosDoPersonal } = loaderData;

	return (
		<>
			<div className="mb-6">
				<Button plain href="/admin/personais">
					<ChevronLeftIcon />
					Voltar
				</Button>
			</div>

			<div className="flex items-end justify-between gap-4">
				<Heading>{personal.nome}</Heading>
				<div className="flex gap-2">
					<Button outline href={`/admin/personais/${personal.id}/editar`}>
						Editar
					</Button>
					<Button color="red">Excluir</Button>
				</div>
			</div>

			<DescriptionList className="mt-8">
				<DescriptionTerm>Nome</DescriptionTerm>
				<DescriptionDetails>{personal.nome}</DescriptionDetails>
				<DescriptionTerm>Email</DescriptionTerm>
				<DescriptionDetails>{personal.email}</DescriptionDetails>
				<DescriptionTerm>Telefone</DescriptionTerm>
				<DescriptionDetails>{personal.telefone}</DescriptionDetails>
				<DescriptionTerm>CREF</DescriptionTerm>
				<DescriptionDetails>
					{personal.cref || <span className="text-zinc-400">—</span>}
				</DescriptionDetails>
			</DescriptionList>

			<Subheading className="mt-12">Alunos</Subheading>
			{alunosDoPersonal.length === 0 ? (
				<p className="mt-4 text-sm text-zinc-500">
					Nenhum aluno vinculado a este personal.
				</p>
			) : (
				<Table className="mt-4">
					<TableHead>
						<TableRow>
							<TableHeader>Nome</TableHeader>
							<TableHeader>Email</TableHeader>
							<TableHeader>Treinos</TableHeader>
						</TableRow>
					</TableHead>
					<TableBody>
						{alunosDoPersonal.map((aluno) => (
							<TableRow key={aluno.id}>
								<TableCell className="font-medium">{aluno.nome}</TableCell>
								<TableCell>{aluno.email}</TableCell>
								<TableCell>
									<div className="flex gap-1.5">
										{aluno.treinos.length > 0 ? (
											aluno.treinos.map((t) => (
												<Badge key={t} color={treinoBadgeColor[t]}>
													Treino {t}
												</Badge>
											))
										) : (
											<span className="text-zinc-400">Nenhum</span>
										)}
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</>
	);
}
