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
import { treinoBadgeColor } from "~/data/types";
import type { Treino } from "~/data/types";
import { api } from "~/lib/api";
import type { Route } from "./+types/detalhe";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const treino = await api.get<Treino>(`/api/aluno/meus-treinos/${params.id}`);
	return { treino };
}

export default function TreinoDetalhe({ loaderData }: Route.ComponentProps) {
	const { treino } = loaderData;

	return (
		<>
			<div className="mb-6">
				<Button plain href="/aluno/treinos">
					<ChevronLeftIcon />
					Voltar
				</Button>
			</div>

			<div className="flex items-center gap-4">
				<Heading>{treino.nome}</Heading>
				<Badge color={treinoBadgeColor[treino.codigo]}>
					Treino {treino.codigo}
				</Badge>
			</div>

			<DescriptionList className="mt-8">
				<DescriptionTerm>Objetivo</DescriptionTerm>
				<DescriptionDetails>{treino.objetivo}</DescriptionDetails>
			</DescriptionList>

			<Subheading className="mt-12">Exercicios</Subheading>

			<Table className="mt-4">
				<TableHead>
					<TableRow>
						<TableHeader className="w-16">#</TableHeader>
						<TableHeader>Exercicio</TableHeader>
						<TableHeader>Series</TableHeader>
						<TableHeader>Repeticoes</TableHeader>
						<TableHeader>Observacoes</TableHeader>
					</TableRow>
				</TableHead>
				<TableBody>
					{treino.exercicios?.map((ex) => (
						<TableRow key={ex.ordem}>
							<TableCell className="font-medium tabular-nums">
								{ex.ordem}
							</TableCell>
							<TableCell className="font-medium">{ex.nome}</TableCell>
							<TableCell>{ex.series}</TableCell>
							<TableCell>{ex.repeticoes}</TableCell>
							<TableCell>
								{ex.observacoes || <span className="text-zinc-400">—</span>}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
}
