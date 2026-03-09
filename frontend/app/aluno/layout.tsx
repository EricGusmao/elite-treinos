import {
	ArrowRightStartOnRectangleIcon,
	ClipboardDocumentListIcon,
	HomeIcon,
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
import { Outlet, useFetcher, useLocation } from "react-router";
import { getInitials, requireRole } from "~/lib/auth-utils";
import type { Route } from "./+types/layout";

export async function clientLoader() {
	const user = await requireRole("aluno");
	return { user };
}

export default function AlunoLayout({ loaderData }: Route.ComponentProps) {
	const { user } = loaderData;
	const { pathname } = useLocation();
	const logoutFetcher = useFetcher();

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
									logoutFetcher.submit(null, {
										method: "post",
										action: "/logout",
									});
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
