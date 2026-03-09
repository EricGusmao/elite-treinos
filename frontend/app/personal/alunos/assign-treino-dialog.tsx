import { Button } from "components/button";
import {
	Dialog,
	DialogActions,
	DialogBody,
	DialogTitle,
} from "components/dialog";
import { ErrorMessage, Field, Label } from "components/fieldset";
import { Select } from "components/select";
import type { FetcherWithComponents } from "react-router";
import type { TreinoSummary } from "~/data/types";

export default function AssignTreinoDialog({
	open,
	onClose,
	treinos,
	fetcher,
}: {
	open: boolean;
	onClose: (open: boolean) => void;
	treinos: TreinoSummary[];
	fetcher: FetcherWithComponents<{ ok?: boolean; error?: string }>;
}) {
	const error = fetcher.data?.error ?? null;

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Atribuir Treino</DialogTitle>
			<fetcher.Form method="post">
				<input type="hidden" name="intent" value="assign" />
				<DialogBody>
					{error && <ErrorMessage className="mb-4">{error}</ErrorMessage>}
					<Field>
						<Label>Selecione o treino</Label>
						<Select name="treino_id">
							{treinos.map((t) => (
								<option key={t.id} value={t.id}>
									Treino {t.codigo} — {t.nome}
								</option>
							))}
						</Select>
					</Field>
				</DialogBody>
				<DialogActions>
					<Button plain onClick={() => onClose(false)}>
						Cancelar
					</Button>
					<Button type="submit" disabled={fetcher.state !== "idle"}>
						{fetcher.state !== "idle" ? "Atribuindo..." : "Atribuir"}
					</Button>
				</DialogActions>
			</fetcher.Form>
		</Dialog>
	);
}
