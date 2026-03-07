import {
	HomeIcon,
	ArrowRightStartOnRectangleIcon,
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
import { Outlet, useLocation } from "react-router";

export default function PersonalLayout() {
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
							<SidebarItem href="/">
								<Avatar
									className="size-6 bg-zinc-900 text-white dark:bg-white dark:text-black"
									initials="CS"
									square
								/>
								<SidebarLabel>Carlos Silva</SidebarLabel>
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
