import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { useNavigate } from "react-router";
import type { User } from "~/data/types";
import { api } from "./api";

type AuthContextType = {
	user: User | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<User>;
	logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		api
			.get<User>("/api/me")
			.then(setUser)
			.catch(() => setUser(null))
			.finally(() => setLoading(false));
	}, []);

	const login = useCallback(
		async (email: string, password: string): Promise<User> => {
			const u = await api.post<User>("/api/login", { email, password });
			setUser(u);

			if (u.role === "superadmin") {
				navigate("/admin/personais");
			} else if (u.role === "personal") {
				navigate("/personal/alunos");
			} else {
				navigate("/aluno/treinos");
			}

			return u;
		},
		[navigate],
	);

	const logout = useCallback(async () => {
		await api.post("/api/logout");
		setUser(null);
		navigate("/");
	}, [navigate]);

	return (
		<AuthContext value={{ user, loading, login, logout }}>
			{children}
		</AuthContext>
	);
}

export function useAuth(): AuthContextType {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return ctx;
}
