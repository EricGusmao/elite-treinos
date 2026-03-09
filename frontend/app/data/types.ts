export type User = {
	id: number;
	name: string;
	email: string;
	role: "superadmin" | "personal" | "aluno";
};

export type Exercicio = {
	ordem: number;
	nome: string;
	series: string;
	repeticoes: string;
	observacoes?: string;
};

export type Treino = {
	id: number;
	codigo: string;
	nome: string;
	objetivo: string;
	exercicios?: Exercicio[];
};

export type AlunoListItem = {
	id: number;
	nome: string;
	email: string;
	dataNascimento: string | null;
};

export type Aluno = {
	id: number;
	nome: string;
	email: string;
	dataNascimento: string | null;
	observacoes: string | null;
	treinos: TreinoSummary[];
};

export type TreinoSummary = {
	id: number;
	codigo: string;
	nome: string;
	objetivo: string;
};

export type AlunoSummary = {
	id: number;
	nome: string;
	email: string;
};

export type PersonalSummary = {
	id: number;
	nome: string;
	email: string;
};

export type Personal = {
	id: number;
	nome: string;
	email: string;
	telefone: string | null;
	cref: string | null;
	alunos?: AlunoSummary[];
};

export type ApiErrors = Record<string, string[]>;

export const treinoBadgeColor: Record<
	string,
	"blue" | "green" | "amber" | "purple"
> = {
	A: "blue",
	B: "green",
	C: "amber",
	D: "purple",
};
