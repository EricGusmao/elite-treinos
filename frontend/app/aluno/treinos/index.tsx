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
import { alunos, treinoBadgeColor, treinos } from "~/data/mock";
import type { Route } from "./+types/index";

export async function clientLoader() {
	const alunoLogado = alunos.find((a) => a.id === "1")!;
	const meusTreinos = treinos.filter((t) =>
		alunoLogado.treinos.includes(t.codigo),
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
