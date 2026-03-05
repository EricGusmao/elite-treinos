import * as Headless from "@headlessui/react";
import type React from "react";
import { forwardRef } from "react";
import { Link as RouterLink, type LinkProps } from "react-router";

export const Link = forwardRef(function Link(
	{ href, ...props }: { href: LinkProps["to"] } & Omit<LinkProps, "to">,
	ref: React.ForwardedRef<HTMLAnchorElement>,
) {
	return (
		<Headless.DataInteractive>
			<RouterLink {...props} to={href} ref={ref} />
		</Headless.DataInteractive>
	);
});
