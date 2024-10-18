import { createEffect, createEvent, createStore } from "effector";
import type { SignupFormValues } from "./signup.schema";
import type { UseFormReturn } from "react-hook-form";
import { initUserDataFx } from "@/shared/init";
import { signUp } from "@/shared/api";
import { sample } from "effector";
import { router } from "@/shared/router";

export const $formMethods = createStore(null);

export const submitSignup = createEvent<SignupFormValues>();
export const formMethodsApiChanged = createEvent<UseFormReturn<SignupFormValues>>();

export const signUpFx = createEffect(async (values: SignupFormValues) => {
	const res = await signUp(values);

	if (!res.sessionId) {
		throw new Error("smth went wrong, please try again");
	}

	const result = await initUserDataFx();
	return result;
});

signUpFx.doneData.watch((result) => {
	router.push("projects", { workspaceId: String(result.workspace.id) });
});

signUpFx.fail.watch(({ error }) => {
	console.error("faild to signup", error.message);
});

sample({
	clock: submitSignup,
	target: signUpFx,
});
