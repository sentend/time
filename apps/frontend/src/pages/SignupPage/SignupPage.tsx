import { z } from "zod";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { apiClient } from "@/shared/api/apiClient";
import { Button, Form, Input, InputField, Text } from "@/shared/ui";
import useError from "@/shared/hooks/useError";
import { humanizeInputError, combineInputErrors } from "@/shared/utils";
import { useAppStore } from "@/shared/store";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sid } from "@/shared/constants";
import { useEffect } from "react";

const signupSchema = z
	.object({
		name: z.string().min(1),
		workspaceName: z.string().optional(),
		email: z.string().email().min(1),
		password: z.string().min(3),
		confirmPassword: z.string().min(3),
	})
	.refine(
		(data) => {
			return data.password === data.confirmPassword;
		},
		{
			message: "passwordsDontMatch",
			path: ["confirmPassword"],
		}
	);

type SignupFormValues = z.infer<typeof signupSchema>;

const errorMap = {
	EmailAlreadyUsed: "Email already used",
};

export const SignupPage = () => {
	const { t } = useTranslation();
	const { initSession } = useAppStore();
	const { error, inputErrorFields, handleError, resetError } = useError(errorMap);

	const handleSignup = async (values: SignupFormValues) => {
		resetError();
		try {
			const res = await apiClient.signUp(values);
			console.log(res);
			if (res.sessionId) {
				Cookies.set(sid, res.sessionId);
				await initSession(res.sessionId);
			}
		} catch (err) {
			handleError(err);
		}
	};

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
	const { register, formState, setFocus } = formMethods;

	useEffect(() => {
		setFocus("email");
	}, [setFocus]);

	const inputErrors = combineInputErrors(
		formState.errors,
		formState.touchedFields,
		inputErrorFields
	);
	console.log(formState.errors, formState.touchedFields);
	console.log(inputErrors);
	return (
		<div className="flex flex-col gap-4 items-center">
			{t("auth.signup")}
			{error && <div>{error}</div>}
			<Form
				formMethods={formMethods}
				onSubmit={handleSignup}
				className="flex flex-col gap-4 w-full"
			>
				<InputField
					label={t("user.email")}
					type="text"
					placeholder={t("user.email")}
					{...register("email")}
				/>
				{inputErrors.email && <Text variant={"error"}>{inputErrors.email}</Text>}
				<InputField label={t("user.name")} type="text" {...register("name")} />
				{inputErrors.name && <Text variant={"error"}>{inputErrors.name}</Text>}
				<InputField label={t("user.workspaceName")} type="text" {...register("workspaceName")} />

				<InputField
					label={t("user.password")}
					placeholder={t("user.password")}
					type="password"
					autoComplete="new-password"
					{...register("password")}
				/>
				{inputErrors.password && <Text variant={"error"}>{inputErrors.password}</Text>}

				<InputField
					label={t("auth.confirmPassword")}
					placeholder={t("auth.confirmPassword")}
					type="password"
					autoComplete="new-password"
					{...register("confirmPassword")}
				/>
				{inputErrors.confirmPassword && (
					<Text variant={"error"}>{inputErrors.confirmPassword}</Text>
				)}

				<Button variant="primary" type="submit">
					{t("auth.signup")}
				</Button>
			</Form>
			<Link to="/login">{t("auth.toLogin")}</Link>
		</div>
	);
};
