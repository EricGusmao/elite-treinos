import { EllipsisVerticalIcon } from "@heroicons/react/16/solid";
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
import type { PersonalSummary } from "~/data/types";
import { api } from "~/lib/api";
import type { Route } from "./+types/index";

export async function clientLoader() {
	const { data: personais } = await api.get<{ data: PersonalSummary[] }>(
		"/api/admin/personais",
	);
	return { personais };
}

export default function PersonaisIndex({ loaderData }: Route.ComponentProps) {
	const { personais } = loaderData;

	return (
		<>
			<div className="flex items-end justify-between gap-4">
				<Heading>Personais</Heading>
				<Button href="/admin/personais/novo">Novo Personal</Button>
			</div>

			<Table className="mt-8">
				<TableHead>
					<TableRow>
						<TableHeader>Nome</TableHeader>
						<TableHeader>Email</TableHeader>
						<TableHeader className="w-0">
							<span className="sr-only">Acoes</span>
						</TableHeader>
					</TableRow>
				</TableHead>
				<TableBody>
					{personais.map((personal) => (
						<TableRow
							key={personal.id}
							href={`/admin/personais/${personal.id}`}
						>
							<TableCell className="font-medium">{personal.nome}</TableCell>
							<TableCell>{personal.email}</TableCell>
							<TableCell>
								<div className="-mx-3 -my-1.5 sm:-mx-2.5">
									<Dropdown>
										<DropdownButton plain aria-label="Opcoes">
											<EllipsisVerticalIcon />
										</DropdownButton>
										<DropdownMenu anchor="bottom end">
											<DropdownItem href={`/admin/personais/${personal.id}`}>
												Ver detalhes
											</DropdownItem>
											<DropdownItem
												href={`/admin/personais/${personal.id}/editar`}
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
