import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import { Badge } from "components/badge";
import { Button } from "components/button";
import {
	DescriptionDetails,
	DescriptionList,
	DescriptionTerm,
} from "components/description-list";
import {
	Dialog,
	DialogActions,
	DialogBody,
	DialogTitle,
} from "components/dialog";
import { ErrorMessage, Field, Label } from "components/fieldset";
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
import { useEffect, useState } from "react";
import { redirect, useFetcher } from "react-router";
import { treinoBadgeColor } from "~/data/types";
import type { Aluno, Treino } from "~/data/types";
import { ValidationError, api } from "~/lib/api";
import type { Route } from "./+types/detalhe";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const [aluno, { data: treinosAtribuidos }, { data: todosTreinos }] =
		await Promise.all([
			api.get<Aluno>(`/api/alunos/${params.id}`),
			api.get<{ data: Treino[] }>(`/api/alunos/${params.id}/treinos`),
			api.get<{ data: Treino[] }>("/api/treinos"),
		]);

	const treinosDisponiveis = todosTreinos.filter(
		(t) => !aluno.treinos.includes(t.codigo),
	);

	return { aluno, treinosAtribuidos, treinosDisponiveis };
}

export async function clientAction({
	request,
	params,
}: Route.ClientActionArgs) {
	const formData = await request.formData();
	const intent = formData.get("intent");

	if (intent === "delete") {
		await api.del(`/api/alunos/${params.id}`);
		return redirect("/personal/alunos");
	}

	if (intent === "assign") {
		const treinoId = formData.get("treino_id");
		try {
			await api.post(`/api/alunos/${params.id}/treinos`, {
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
		await api.del(`/api/alunos/${params.id}/treinos/${treinoId}`);
		return { ok: true };
	}

	throw new Error(`Unknown intent: ${intent}`);
}

export default function AlunoDetalhe({ loaderData }: Route.ComponentProps) {
	const { aluno, treinosAtribuidos, treinosDisponiveis } = loaderData;
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogError, setDialogError] = useState<string | null>(null);

	const deleteFetcher = useFetcher();
	const assignFetcher = useFetcher();
	const removeFetcher = useFetcher();

	const deleting = deleteFetcher.state !== "idle";
	const limiteAtingido = aluno.treinos.length >= 2;

	useEffect(() => {
		if (assignFetcher.state === "idle" && assignFetcher.data) {
			if (assignFetcher.data.ok) {
				setIsDialogOpen(false);
				setDialogError(null);
			} else if (assignFetcher.data.error) {
				setDialogError(assignFetcher.data.error);
			}
		}
	}, [assignFetcher.state, assignFetcher.data]);

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
					<Button
						color="red"
						disabled={deleting}
						onClick={() => {
							if (!confirm("Tem certeza que deseja excluir este aluno?"))
								return;
							deleteFetcher.submit({ intent: "delete" }, { method: "post" });
						}}
					>
						{deleting ? "Excluindo..." : "Excluir"}
					</Button>
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
					onClick={() => {
						setDialogError(null);
						setIsDialogOpen(true);
					}}
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
									<Button
										plain
										onClick={() =>
											removeFetcher.submit(
												{ intent: "remove", treino_id: String(treino.id) },
												{ method: "post" },
											)
										}
									>
										Remover
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}

			<Dialog open={isDialogOpen} onClose={setIsDialogOpen}>
				<DialogTitle>Atribuir Treino</DialogTitle>
				<assignFetcher.Form method="post">
					<input type="hidden" name="intent" value="assign" />
					<DialogBody>
						{dialogError && (
							<ErrorMessage className="mb-4">{dialogError}</ErrorMessage>
						)}
						<Field>
							<Label>Selecione o treino</Label>
							<Select name="treino_id">
								{treinosDisponiveis.map((t) => (
									<option key={t.id} value={t.id}>
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
						<Button type="submit" disabled={assignFetcher.state !== "idle"}>
							{assignFetcher.state !== "idle" ? "Atribuindo..." : "Atribuir"}
						</Button>
					</DialogActions>
				</assignFetcher.Form>
			</Dialog>
		</>
	);
}
