import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import { Badge } from "components/badge";
import { Button } from "components/button";
import {
	DescriptionDetails,
	DescriptionList,
	DescriptionTerm,
} from "components/description-list";
import { Heading, Subheading } from "components/heading";
import { Text } from "components/text";
import { useState } from "react";
import { redirect, useFetcher } from "react-router";
import { treinoBadgeColor } from "~/data/types";
import type { Aluno, Treino } from "~/data/types";
import { ValidationError, api } from "~/lib/api";
import AssignTreinoDialog from "./assign-treino-dialog";
import type { Route } from "./+types/detalhe";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const [aluno, { data: treinos }] = await Promise.all([
		api.get<Aluno>(`/api/personal/alunos/${params.id}`),
		api.get<{ data: Treino[] }>("/api/treinos"),
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

	const deleteFetcher = useFetcher();
	const assignFetcher = useFetcher();
	const removeFetcher = useFetcher();

	const deleting = deleteFetcher.state !== "idle";
	const limiteAtingido = aluno.treinos.length >= 2;

	const treinosDisponiveis = treinos.filter(
		(t) => !aluno.treinos.some((at) => at.codigo === t.codigo),
	);

	if (
		isDialogOpen &&
		assignFetcher.state === "idle" &&
		assignFetcher.data?.ok
	) {
		setIsDialogOpen(false);
	}

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

			<TreinosTable treinos={aluno.treinos} removeFetcher={removeFetcher} />

			<AssignTreinoDialog
				open={isDialogOpen}
				onClose={setIsDialogOpen}
				treinos={treinosDisponiveis}
				fetcher={assignFetcher}
			/>
		</>
	);
}

function TreinosTable({
	treinos,
	removeFetcher,
}: {
	treinos: Treino[];
	removeFetcher: ReturnType<typeof useFetcher>;
}) {
	if (treinos.length === 0) {
		return <Text className="mt-4">Nenhum treino atribuido.</Text>;
	}

	return (
		<table className="mt-4 w-full text-left text-sm">
			<thead>
				<tr className="border-b border-zinc-950/10 dark:border-white/10">
					<th className="py-2 font-medium">Codigo</th>
					<th className="py-2 font-medium">Nome</th>
					<th className="py-2 font-medium">Objetivo</th>
					<th className="w-0 py-2">
						<span className="sr-only">Acoes</span>
					</th>
				</tr>
			</thead>
			<tbody>
				{treinos.map((treino) => (
					<tr
						key={treino.id}
						className="border-b border-zinc-950/5 dark:border-white/5"
					>
						<td className="py-2">
							<Badge color={treinoBadgeColor[treino.codigo]}>
								Treino {treino.codigo}
							</Badge>
						</td>
						<td className="py-2 font-medium">{treino.nome}</td>
						<td className="py-2">{treino.objetivo}</td>
						<td className="py-2">
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
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
