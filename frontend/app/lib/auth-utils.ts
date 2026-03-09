import { redirect } from "react-router";
import type { User } from "~/data/types";
import { api } from "./api";

export function getInitials(name: string): string {
	return name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

export function roleRedirect(user: User) {
	if (user.role === "superadmin") return redirect("/admin/personais");
	if (user.role === "personal") return redirect("/personal/alunos");
	return redirect("/aluno/treinos");
}

export async function requireRole(role: User["role"]): Promise<User> {
	try {
		const user = await api.get<User>("/api/me", { skipAuthRedirect: true });
		if (user.role !== role) throw redirect("/");
		return user;
	} catch (err) {
		if (err instanceof Response) throw err;
		throw redirect("/");
	}
}
