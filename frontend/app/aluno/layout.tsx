import {
	HomeIcon,
	ArrowRightStartOnRectangleIcon,
	ClipboardDocumentListIcon,
} from "@heroicons/react/20/solid";
import { Avatar } from "components/avatar";
import { Navbar, NavbarSpacer } from "components/navbar";
import {
	Sidebar,
	SidebarBody,
	SidebarFooter,
	SidebarHeader,
	SidebarItem,
	SidebarLabel,
	SidebarSection,
} from "components/sidebar";
import { SidebarLayout } from "components/sidebar-layout";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "~/lib/auth";

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

export default function AlunoLayout() {
	const { pathname } = useLocation();
	const { user, loading, logout } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!loading && (!user || user.role !== "aluno")) {
			navigate("/");
		}
	}, [user, loading, navigate]);

	if (loading || !user) return null;

	return (
		<SidebarLayout
			navbar={
				<Navbar>
					<NavbarSpacer />
				</Navbar>
			}
			sidebar={
				<Sidebar>
					<SidebarHeader>
						<SidebarSection>
							<SidebarItem href="/aluno/treinos">
								<HomeIcon />
								<SidebarLabel>Elite Treinos</SidebarLabel>
							</SidebarItem>
						</SidebarSection>
					</SidebarHeader>
					<SidebarBody>
						<SidebarSection>
							<SidebarItem
								href="/aluno/treinos"
								current={pathname.startsWith("/aluno/treinos")}
							>
								<ClipboardDocumentListIcon />
								<SidebarLabel>Meus Treinos</SidebarLabel>
							</SidebarItem>
						</SidebarSection>
					</SidebarBody>
					<SidebarFooter>
						<SidebarSection>
							<SidebarItem href="/aluno/treinos">
								<Avatar
									className="size-6 bg-zinc-900 text-white dark:bg-white dark:text-black"
									initials={getInitials(user.name)}
									square
								/>
								<SidebarLabel>{user.name}</SidebarLabel>
							</SidebarItem>
							<SidebarItem
								onClick={(e: React.MouseEvent) => {
									e.preventDefault();
									logout();
								}}
							>
								<ArrowRightStartOnRectangleIcon />
								<SidebarLabel>Sair</SidebarLabel>
							</SidebarItem>
						</SidebarSection>
					</SidebarFooter>
				</Sidebar>
			}
		>
			<Outlet />
		</SidebarLayout>
	);
}
