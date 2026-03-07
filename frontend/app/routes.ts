import {
	index,
	layout,
	route,
	type RouteConfig,
} from "@react-router/dev/routes";

export default [
	index("auth/login.tsx"),

	// Superadmin
	layout("admin/layout.tsx", [
		route("/admin/personais", "admin/personais/index.tsx"),
		route("/admin/personais/novo", "admin/personais/novo.tsx"),
		route("/admin/personais/:id", "admin/personais/detalhe.tsx"),
		route("/admin/personais/:id/editar", "admin/personais/editar.tsx"),
	]),

	// Personal
	layout("personal/layout.tsx", [
		route("/personal/alunos", "personal/alunos/index.tsx"),
		route("/personal/alunos/novo", "personal/alunos/novo.tsx"),
		route("/personal/alunos/:id", "personal/alunos/detalhe.tsx"),
		route("/personal/alunos/:id/editar", "personal/alunos/editar.tsx"),
	]),

	// Aluno
	layout("aluno/layout.tsx", [
		route("/aluno/treinos", "aluno/treinos/index.tsx"),
		route("/aluno/treinos/:id", "aluno/treinos/detalhe.tsx"),
	]),
] satisfies RouteConfig;
