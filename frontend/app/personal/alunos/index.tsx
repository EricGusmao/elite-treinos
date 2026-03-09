import { EllipsisVerticalIcon } from "@heroicons/react/16/solid";
import { Badge } from "components/badge";
import { Button } from "components/button";
import {
	Dropdown,
	DropdownButton,
	DropdownItem,
	DropdownMenu,
} from "components/dropdown";
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
import type { Aluno } from "~/data/types";
import { api } from "~/lib/api";
import type { Route } from "./+types/index";

export async function clientLoader() {
	const { data: meusAlunos } = await api.get<{ data: Aluno[] }>(
		"/api/personal/alunos",
	);
	return { meusAlunos };
}

export default function AlunosIndex({ loaderData }: Route.ComponentProps) {
	const { meusAlunos } = loaderData;

	return (
		<>
			<div className="flex items-end justify-between gap-4">
				<Heading>Alunos</Heading>
				<Button href="/personal/alunos/novo">Novo Aluno</Button>
			</div>

			<Table className="mt-8">
				<TableHead>
					<TableRow>
						<TableHeader>Nome</TableHeader>
						<TableHeader>Email</TableHeader>
						<TableHeader>Data de Nascimento</TableHeader>
						<TableHeader>Treinos</TableHeader>
						<TableHeader className="w-0">
							<span className="sr-only">Acoes</span>
						</TableHeader>
					</TableRow>
				</TableHead>
				<TableBody>
					{meusAlunos.map((aluno) => (
						<TableRow key={aluno.id} href={`/personal/alunos/${aluno.id}`}>
							<TableCell className="font-medium">{aluno.nome}</TableCell>
							<TableCell>{aluno.email}</TableCell>
							<TableCell>
								{aluno.dataNascimento
									? new Date(aluno.dataNascimento).toLocaleDateString("pt-BR")
									: "—"}
							</TableCell>
							<TableCell>
								<div className="flex gap-1.5">
									{aluno.treinos.length > 0 ? (
										aluno.treinos.map((t) => (
											<Badge key={t.codigo} color={treinoBadgeColor[t.codigo]}>
												Treino {t.codigo}
											</Badge>
										))
									) : (
										<span className="text-zinc-400">Nenhum</span>
									)}
								</div>
							</TableCell>
							<TableCell>
								<div className="-mx-3 -my-1.5 sm:-mx-2.5">
									<Dropdown>
										<DropdownButton plain aria-label="Opcoes">
											<EllipsisVerticalIcon />
										</DropdownButton>
										<DropdownMenu anchor="bottom end">
											<DropdownItem href={`/personal/alunos/${aluno.id}`}>
												Ver detalhes
											</DropdownItem>
											<DropdownItem
												href={`/personal/alunos/${aluno.id}/editar`}
											>
												Editar
											</DropdownItem>
											<DropdownItem>Excluir</DropdownItem>
										</DropdownMenu>
									</Dropdown>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
}
