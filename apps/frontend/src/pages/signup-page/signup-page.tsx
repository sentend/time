import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, InputField } from "@/shared/ui/form";
import { Button } from "@/shared/ui/button";
import { Link } from "@swan-io/chicane";
import { router } from "@/shared/router/router";
import { formMethodsApiChanged, signupSchema, submitSignup, type SignupFormValues } from "./model";
import { useEffect } from "react";
import { useUnit } from "effector-react";

export const SignupPage = () => {
	const { t } = useTranslation();

	const onFormMethodsApiChanged = useUnit(formMethodsApiChanged);

	const formMethods = useForm<SignupFormValues>({
		defaultValues: {
			confirmPassword: "",
			email: "",
			name: "",
			password: "",
			workspaceName: "",
		},
		resolver: zodResolver(signupSchema),
	});

	useEffect(() => {
		onFormMethodsApiChanged(formMethods);
	}, [formMethods, onFormMethodsApiChanged]);
	const { register } = formMethods;

	return (
		<div className="flex flex-col gap-4 items-center">
			{t("auth.signup")}
			<Form
				formMethods={formMethods}
				onSubmit={submitSignup}
				className="flex flex-col gap-4 w-full"
			>
				<InputField
					autoFocus
					label={t("user.email")}
					type="text"
					placeholder={t("user.email")}
					{...register("email")}
				/>
				<InputField label={t("user.name")} type="text" {...register("name")} />
				<InputField label={t("user.workspaceName")} type="text" {...register("workspaceName")} />

				<InputField
					label={t("user.password")}
					placeholder={t("user.password")}
					type="password"
					autoComplete="new-password"
					{...register("password")}
				/>

				<InputField
					label={t("auth.confirmPassword")}
					placeholder={t("auth.confirmPassword")}
					type="password"
					autoComplete="new-password"
					{...register("confirmPassword")}
				/>

				<Button variant="primary" type="submit">
					{t("auth.signup")}
				</Button>
			</Form>
			<Link to={router.signin()}>{t("auth.toLogin")}</Link>
		</div>
	);
};
