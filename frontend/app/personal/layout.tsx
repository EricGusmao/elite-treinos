import {
	ArrowRightStartOnRectangleIcon,
	HomeIcon,
	UsersIcon,
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
	const user = await requireRole("personal");
	return { user };
}

export default function PersonalLayout({ loaderData }: Route.ComponentProps) {
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
							<SidebarItem href="/personal/alunos">
								<HomeIcon />
								<SidebarLabel>Elite Treinos</SidebarLabel>
							</SidebarItem>
						</SidebarSection>
					</SidebarHeader>
					<SidebarBody>
						<SidebarSection>
							<SidebarItem
								href="/personal/alunos"
								current={pathname.startsWith("/personal/alunos")}
							>
								<UsersIcon />
								<SidebarLabel>Alunos</SidebarLabel>
							</SidebarItem>
						</SidebarSection>
					</SidebarBody>
					<SidebarFooter>
						<SidebarSection>
							<SidebarItem href="/personal/alunos">
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
