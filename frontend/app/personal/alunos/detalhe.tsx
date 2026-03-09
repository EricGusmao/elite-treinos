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
import { Text } from "components/text";
import { useEffect, useState } from "react";
import { Form, redirect, useFetcher, useNavigation } from "react-router";
import { treinoBadgeColor } from "~/data/types";
import type { Aluno, TreinoSummary } from "~/data/types";
import { ValidationError, api } from "~/lib/api";
import AssignTreinoDialog from "./assign-treino-dialog";
import type { Route } from "./+types/detalhe";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const [aluno, { data: treinos }] = await Promise.all([
		api.get<Aluno>(`/api/personal/alunos/${params.id}`),
		api.get<{ data: TreinoSummary[] }>("/api/personal/treinos"),
	]);
	return { aluno, treinos };
}

export async function clientAction({
	request,
	params,
}: Route.ClientActionArgs) {
	const formData = await request.formData();
	const intent = formData.get("intent");

	if (intent === "delete") {
		await api.del(`/api/personal/alunos/${params.id}`);
		return redirect("/personal/alunos");
	}

	if (intent === "assign") {
		const treinoId = formData.get("treino_id");
		try {
			await api.post(`/api/personal/alunos/${params.id}/treinos`, {
				treino_id: Number(treinoId),
			});
			return { ok: true };
		} catch (err) {
			if (err instanceof ValidationError) {
				const firstError = Object.values(err.errors)[0];
				return { error: firstError?.[0] ?? "Erro de validacao." };
			}
			if (err instanceof Error) {
				return { error: err.message };
			}
			throw err;
		}
	}

	if (intent === "remove") {
		const treinoId = formData.get("treino_id");
		await api.del(`/api/personal/alunos/${params.id}/treinos/${treinoId}`);
		return { ok: true };
	}

	throw new Error(`Unknown intent: ${intent}`);
}

export default function AlunoDetalhe({ loaderData }: Route.ComponentProps) {
	const { aluno, treinos } = loaderData;
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const navigation = useNavigation();
	const assignFetcher = useFetcher();
	const removeFetcher = useFetcher();

	const deleting = navigation.state !== "idle";
	const limiteAtingido = aluno.treinos.length >= 2;

	const treinosDisponiveis = treinos.filter(
		(t) => !aluno.treinos.some((at) => at.codigo === t.codigo),
	);

	useEffect(() => {
		if (assignFetcher.state === "idle" && assignFetcher.data?.ok) {
			setIsDialogOpen(false);
			assignFetcher.reset();
		}
	}, [assignFetcher.state, assignFetcher.data, assignFetcher.reset]);

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
					<Form
						method="post"
						onSubmit={(e) => {
							if (!confirm("Tem certeza que deseja excluir este aluno?"))
								e.preventDefault();
						}}
					>
						<input type="hidden" name="intent" value="delete" />
						<Button type="submit" color="red" disabled={deleting}>
							{deleting ? "Excluindo..." : "Excluir"}
						</Button>
					</Form>
				</div>
			</div>

			<DescriptionList className="mt-8">
				<DescriptionTerm>Nome</DescriptionTerm>
				<DescriptionDetails>{aluno.nome}</DescriptionDetails>
				<DescriptionTerm>Email</DescriptionTerm>
				<DescriptionDetails>{aluno.email}</DescriptionDetails>
				<DescriptionTerm>Data de Nascimento</DescriptionTerm>
				<DescriptionDetails>
					{aluno.dataNascimento
						? new Date(aluno.dataNascimento).toLocaleDateString("pt-BR")
						: "—"}
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

			{aluno.treinos.length === 0 ? (
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
						{aluno.treinos.map((treino) => (
							<TableRow key={treino.id} href={`/personal/treinos/${treino.id}`}>
								<TableCell>
									<Badge color={treinoBadgeColor[treino.codigo]}>
										Treino {treino.codigo}
									</Badge>
								</TableCell>
								<TableCell className="font-medium">{treino.nome}</TableCell>
								<TableCell>{treino.objetivo}</TableCell>
								<TableCell>
									<Button
										plain
										onClick={(e: React.MouseEvent) => {
											e.preventDefault();
											removeFetcher.submit(
												{ intent: "remove", treino_id: String(treino.id) },
												{ method: "post" },
											);
										}}
									>
										Remover
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}

			<AssignTreinoDialog
				open={isDialogOpen}
				onClose={setIsDialogOpen}
				treinos={treinosDisponiveis}
				fetcher={assignFetcher}
			/>
		</>
	);
}
