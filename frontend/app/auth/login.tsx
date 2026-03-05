import { AuthLayout } from "components/auth-layout";
import { Button } from "components/button";
import { Field, Label } from "components/fieldset";
import { Heading } from "components/heading";
import { Input } from "components/input";
import { Form } from "react-router";

export default function Login() {
	return (
		<AuthLayout>
			<Form method="POST" className="grid w-full max-w-sm grid-cols-1 gap-8">
				<Heading>Sign in to your account</Heading>
				<Field>
					<Label>Email</Label>
					<Input type="email" name="email" />
				</Field>
				<Field>
					<Label>Password</Label>
					<Input type="password" name="password" />
				</Field>
				<Button type="submit" className="w-full">
					Login
				</Button>
			</Form>
		</AuthLayout>
	);
}
