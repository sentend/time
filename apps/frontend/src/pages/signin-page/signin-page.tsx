import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signinFormSchema } from "./model";
import { Form, InputField } from "@/shared/ui/form";
import { Text } from "@/shared/ui/text";
import { Button } from "@/shared/ui/button";
import { Link } from "@swan-io/chicane";
import { router } from "@/shared/router/router";
import { formMethodsApiChanged, submitSignin } from "./model/signin.model";
import { useEffect } from "react";
import { useUnit } from "effector-react";

export const SigninPage = () => {
	const { t } = useTranslation();

	const onFormMethodsApiChanged = useUnit(formMethodsApiChanged);

	const formMethods = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		resolver: zodResolver(signinFormSchema),
	});

	useEffect(() => {
		console.log("form methods");
		onFormMethodsApiChanged(formMethods);
	}, [formMethods, onFormMethodsApiChanged]);

	const { register, formState } = formMethods;

	return (
		<div className="container">
			<div className="flex flex-col gap-4 items-center">
				<Form
					formMethods={formMethods}
					onSubmit={submitSignin}
					className="flex flex-col gap-4 w-full"
				>
					<InputField
						type="text"
						placeholder={t("user.email")}
						label={t("user.email")}
						{...register("email")}
					/>
					{formState.errors.email?.message && (
						<Text variant={"error"}>{formState.errors.email?.message}</Text>
					)}
					<InputField
						type="password"
						placeholder={t("user.password")}
						label={t("user.password")}
						{...register("password")}
					/>
					{formState.errors.password?.message && (
						<Text variant={"error"}>{formState.errors.password?.message}</Text>
					)}
					<Button variant={"primary"} type="submit">
						{t("auth.login")}
					</Button>
					{formState.touchedFields.email}
				</Form>
				{/* <Link to="/reset-password">{t("auth.forgetPassword")}</Link> */}
				<Link to={router.signup()}>{t("auth.toSignup")}</Link>
			</div>
		</div>
	);
};
