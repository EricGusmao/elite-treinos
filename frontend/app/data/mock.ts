export type Exercicio = {
	ordem: number;
	nome: string;
	series: string;
	repeticoes: string;
	observacoes?: string;
};

export type Treino = {
	id: string;
	codigo: string;
	nome: string;
	objetivo: string;
	exercicios: Exercicio[];
};

export type Aluno = {
	id: string;
	nome: string;
	email: string;
	dataNascimento: string;
	observacoes?: string;
	personalId: string;
	treinos: string[]; // treino codes (A, B, C, D)
};

export type Personal = {
	id: string;
	nome: string;
	email: string;
	telefone: string;
	cref?: string;
};

export const treinos: Treino[] = [
	{
		id: "1",
		codigo: "A",
		nome: "Treino A — Full Body (Base)",
		objetivo: "Adaptacao geral e base de forca",
		exercicios: [
			{ ordem: 1, nome: "Agachamento livre", series: "3", repeticoes: "10" },
			{ ordem: 2, nome: "Supino reto", series: "3", repeticoes: "10" },
			{ ordem: 3, nome: "Remada curvada", series: "3", repeticoes: "10" },
			{
				ordem: 4,
				nome: "Desenvolvimento militar",
				series: "3",
				repeticoes: "12",
			},
			{ ordem: 5, nome: "Prancha", series: "3", repeticoes: "30-45s" },
		],
	},
	{
		id: "2",
		codigo: "B",
		nome: "Treino B — Inferiores (Pernas/Gluteos)",
		objetivo: "Foco em pernas e gluteos",
		exercicios: [
			{ ordem: 1, nome: "Leg press", series: "4", repeticoes: "12" },
			{
				ordem: 2,
				nome: "Afundo (passada)",
				series: "3",
				repeticoes: "10",
				observacoes: "cada perna",
			},
			{ ordem: 3, nome: "Mesa flexora", series: "3", repeticoes: "12" },
			{ ordem: 4, nome: "Cadeira extensora", series: "3", repeticoes: "12" },
			{ ordem: 5, nome: "Elevacao pelvica", series: "4", repeticoes: "10" },
		],
	},
	{
		id: "3",
		codigo: "C",
		nome: "Treino C — Superiores (Peito/Costas/Ombros)",
		objetivo: "Hipertrofia de tronco",
		exercicios: [
			{ ordem: 1, nome: "Supino inclinado", series: "4", repeticoes: "10" },
			{
				ordem: 2,
				nome: "Puxada na barra (pulldown)",
				series: "4",
				repeticoes: "10",
			},
			{ ordem: 3, nome: "Remada baixa", series: "3", repeticoes: "12" },
			{ ordem: 4, nome: "Elevacao lateral", series: "3", repeticoes: "15" },
			{ ordem: 5, nome: "Rosca direta", series: "3", repeticoes: "12" },
		],
	},
	{
		id: "4",
		codigo: "D",
		nome: "Treino D — Condicionamento + Core",
		objetivo: "Condicionamento e core",
		exercicios: [
			{
				ordem: 1,
				nome: "HIIT na esteira/bike",
				series: "1",
				repeticoes: "10-15 min",
				observacoes: "30s forte / 60s leve",
			},
			{ ordem: 2, nome: "Burpee", series: "3", repeticoes: "10" },
			{ ordem: 3, nome: "Abdominal infra", series: "3", repeticoes: "15" },
			{
				ordem: 4,
				nome: "Prancha lateral",
				series: "3",
				repeticoes: "30s",
				observacoes: "cada lado",
			},
			{
				ordem: 5,
				nome: "Alongamento final",
				series: "1",
				repeticoes: "5 min",
			},
		],
	},
];

export const personais: Personal[] = [
	{
		id: "1",
		nome: "Carlos Silva",
		email: "carlos@elite.com",
		telefone: "(11) 99999-0001",
		cref: "012345-G/SP",
	},
	{
		id: "2",
		nome: "Ana Oliveira",
		email: "ana@elite.com",
		telefone: "(11) 99999-0002",
		cref: "067890-G/SP",
	},
	{
		id: "3",
		nome: "Roberto Santos",
		email: "roberto@elite.com",
		telefone: "(11) 99999-0003",
	},
];

export const alunos: Aluno[] = [
	{
		id: "1",
		nome: "Joao Pereira",
		email: "joao@email.com",
		dataNascimento: "1995-03-15",
		personalId: "1",
		treinos: ["A", "B"],
	},
	{
		id: "2",
		nome: "Maria Costa",
		email: "maria@email.com",
		dataNascimento: "1998-07-22",
		observacoes: "Problema no joelho esquerdo",
		personalId: "1",
		treinos: ["C"],
	},
	{
		id: "3",
		nome: "Pedro Lima",
		email: "pedro@email.com",
		dataNascimento: "2000-01-10",
		personalId: "2",
		treinos: ["A", "D"],
	},
	{
		id: "4",
		nome: "Lucia Ferreira",
		email: "lucia@email.com",
		dataNascimento: "1992-11-05",
		personalId: "2",
		treinos: ["B"],
	},
	{
		id: "5",
		nome: "Rafael Souza",
		email: "rafael@email.com",
		dataNascimento: "1997-06-18",
		personalId: "3",
		treinos: [],
	},
];

export const treinoBadgeColor: Record<
	string,
	"blue" | "green" | "amber" | "purple"
> = {
	A: "blue",
	B: "green",
	C: "amber",
	D: "purple",
};
