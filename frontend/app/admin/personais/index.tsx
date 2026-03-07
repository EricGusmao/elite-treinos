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
import { personais } from "~/data/mock";

export default function PersonaisIndex() {
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
						<TableHeader>Telefone</TableHeader>
						<TableHeader>CREF</TableHeader>
						<TableHeader className="w-0">
							<span className="sr-only">Acoes</span>
						</TableHeader>
					</TableRow>
				</TableHead>
				<TableBody>
					{personais.map((personal) => (
						<TableRow key={personal.id} href={`/admin/personais/${personal.id}`}>
							<TableCell className="font-medium">
								{personal.nome}
							</TableCell>
							<TableCell>{personal.email}</TableCell>
							<TableCell>{personal.telefone}</TableCell>
							<TableCell>
								{personal.cref ? (
									<Badge color="blue">{personal.cref}</Badge>
								) : (
									<span className="text-zinc-400">—</span>
								)}
							</TableCell>
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
