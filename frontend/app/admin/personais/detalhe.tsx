import { ChevronLeftIcon } from "@heroicons/react/16/solid";
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
import { Form, redirect, useNavigation } from "react-router";
import type { Personal } from "~/data/types";
import { api } from "~/lib/api";
import type { Route } from "./+types/detalhe";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const personal = await api.get<Personal>(`/api/admin/personais/${params.id}`);
	return { personal };
}

export async function clientAction({ params }: Route.ClientActionArgs) {
	await api.del(`/api/admin/personais/${params.id}`);
	return redirect("/admin/personais");
}

export default function PersonalDetalhe({ loaderData }: Route.ComponentProps) {
	const { personal } = loaderData;
	const alunosDoPersonal = personal.alunos ?? [];
	const navigation = useNavigation();
	const deleting = navigation.state !== "idle";

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
					<Form
						method="post"
						onSubmit={(e) => {
							if (!confirm("Tem certeza que deseja excluir este personal?"))
								e.preventDefault();
						}}
					>
						<Button type="submit" color="red" disabled={deleting}>
							{deleting ? "Excluindo..." : "Excluir"}
						</Button>
					</Form>
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
						</TableRow>
					</TableHead>
					<TableBody>
						{alunosDoPersonal.map((aluno) => (
							<TableRow key={aluno.id}>
								<TableCell className="font-medium">{aluno.nome}</TableCell>
								<TableCell>{aluno.email}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</>
	);
}
