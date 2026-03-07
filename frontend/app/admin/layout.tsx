import {
	HomeIcon,
	ArrowRightStartOnRectangleIcon,
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
import { Outlet, useLocation } from "react-router";

export default function AdminLayout() {
	const { pathname } = useLocation();

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
							<SidebarItem href="/">
								<Avatar
									className="size-6 bg-zinc-900 text-white dark:bg-white dark:text-black"
									initials="SA"
									square
								/>
								<SidebarLabel>Superadmin</SidebarLabel>
							</SidebarItem>
							<SidebarItem href="/">
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
