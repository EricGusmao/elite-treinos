import {
	ArrowRightStartOnRectangleIcon,
	HomeIcon,
	UserGroupIcon,
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
	const user = await requireRole("superadmin");
	return { user };
}

export default function AdminLayout({ loaderData }: Route.ComponentProps) {
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
							<SidebarItem href="/admin/personais">
								<HomeIcon />
								<SidebarLabel>Elite Treinos</SidebarLabel>
							</SidebarItem>
						</SidebarSection>
					</SidebarHeader>
					<SidebarBody>
						<SidebarSection>
							<SidebarItem
								href="/admin/personais"
								current={pathname.startsWith("/admin/personais")}
							>
								<UserGroupIcon />
								<SidebarLabel>Personais</SidebarLabel>
							</SidebarItem>
						</SidebarSection>
					</SidebarBody>
					<SidebarFooter>
						<SidebarSection>
							<SidebarItem href="/admin/personais">
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
