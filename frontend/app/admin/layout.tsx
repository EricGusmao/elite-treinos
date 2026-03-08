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

export default function AdminLayout() {
	const { pathname } = useLocation();
	const { user, loading, logout } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!loading && (!user || user.role !== "superadmin")) {
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
