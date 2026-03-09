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
import { Text } from "components/text";
import { treinoBadgeColor } from "~/data/types";
import type { TreinoSummary } from "~/data/types";
import { api } from "~/lib/api";
import type { Route } from "./+types/index";

export async function clientLoader() {
	const { data: meusTreinos } = await api.get<{ data: TreinoSummary[] }>(
		"/api/aluno/meus-treinos",
	);
	return { meusTreinos };
}

export default function MeusTreinos({ loaderData }: Route.ComponentProps) {
	const { meusTreinos } = loaderData;

	return (
		<>
			<Heading>Meus Treinos</Heading>
			<Text className="mt-2">Visualize os treinos atribuidos para voce.</Text>

			{meusTreinos.length === 0 ? (
				<Text className="mt-8">Nenhum treino atribuido ainda.</Text>
			) : (
				<Table className="mt-8">
					<TableHead>
						<TableRow>
							<TableHeader>Codigo</TableHeader>
							<TableHeader>Nome</TableHeader>
							<TableHeader>Objetivo</TableHeader>
						</TableRow>
					</TableHead>
					<TableBody>
						{meusTreinos.map((treino) => (
							<TableRow key={treino.id} href={`/aluno/treinos/${treino.id}`}>
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
			)}
		</>
	);
}
