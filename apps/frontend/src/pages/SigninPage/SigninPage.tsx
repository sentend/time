import { z } from "zod";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import api from "@/shared/api/ApiClient";
import { useAppStore } from "@/shared/store";
import { Button, Form, Input, InputField, Text } from "@/shared/ui";
import useError from "@/shared/hooks/useError";
import combineInputErrors from "@/shared/utils/combineInputErrors";
import humanizeInputError from "@/shared/utils/humanizeInputError";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sid } from "@/shared/constants";
import { useEffect } from "react";

const signinSchema = z.object({
	email: z.string().min(1).email(),
	password: z.string().min(1),
});

type SigninFormValues = z.infer<typeof signinSchema>;

//? need to add translation
const errorsMap = {
	EmailOrPasswordIsNotCorrect: "Email or password you've entered is not correct. Please try again.",
};

export const SigninPage = () => {
	const { t } = useTranslation();
	const { initSession } = useAppStore();
	const { error, inputErrorFields, handleError, resetError } = useError(errorsMap);

	const handleSingin = async (values: SigninFormValues) => {
		try {
			resetError();
			const { email, password } = values;
			const res = await api.signIn(email, password);
			if (res.sessionId) {
				Cookies.set(sid, res.sessionId);
				await initSession(res.sessionId);
			}
		} catch (err) {
			handleError(err);
		}
	};

	const formMethods = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		resolver: zodResolver(signinSchema),
	});

	const { register, formState } = formMethods;

	console.log(formState.errors, formState.touchedFields);

	const inputErrors = combineInputErrors(
		formState.errors,
		formState.touchedFields,
		inputErrorFields
	);

	console.log(inputErrors);

	return (
		<div className="container">
			<div className="flex flex-col gap-4 items-center">
				<Form
					formMethods={formMethods}
					onSubmit={handleSingin}
					className="flex flex-col gap-4 w-full"
				>
					{error && <div>{error}</div>}
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
				<Link to="/reset-password">{t("auth.forgetPassword")}</Link>
				<Link to="/signup">{t("auth.toSignup")}</Link>
			</div>
		</div>
	);
};
