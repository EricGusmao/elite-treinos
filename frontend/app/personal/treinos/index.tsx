import { Badge } from "components/badge";
import { Heading } from "components/heading";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "components/table";
import { treinoBadgeColor } from "~/data/types";
import type { TreinoSummary } from "~/data/types";
import { api } from "~/lib/api";
import type { Route } from "./+types/index";

export async function clientLoader() {
	const { data: treinos } = await api.get<{ data: TreinoSummary[] }>(
		"/api/treinos",
	);
	return { treinos };
}

export default function TreinosIndex({ loaderData }: Route.ComponentProps) {
	const { treinos } = loaderData;

	return (
		<>
			<Heading>Treinos</Heading>

			<Table className="mt-8">
				<TableHead>
					<TableRow>
						<TableHeader>Codigo</TableHeader>
						<TableHeader>Nome</TableHeader>
						<TableHeader>Objetivo</TableHeader>
					</TableRow>
				</TableHead>
				<TableBody>
					{treinos.map((treino) => (
						<TableRow key={treino.id} href={`/personal/treinos/${treino.id}`}>
							<TableCell>
								<Badge color={treinoBadgeColor[treino.codigo]}>
									Treino {treino.codigo}
								</Badge>
							</TableCell>
							<TableCell className="font-medium">{treino.nome}</TableCell>
							<TableCell>{treino.objetivo}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
}
