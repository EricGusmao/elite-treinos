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
import { Outlet, useLocation } from "react-router";

export default function AlunoLayout() {
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
							<SidebarItem href="/">
								<Avatar
									className="size-6 bg-zinc-900 text-white dark:bg-white dark:text-black"
									initials="JP"
									square
								/>
								<SidebarLabel>Joao Pereira</SidebarLabel>
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
