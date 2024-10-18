import { signIn } from "@/shared/api";
import type { SigninFormSchema } from "./signin.schema";

import { router } from "@/shared/router";
import { createEffect, createEvent, createStore, sample } from "effector";
import { initUserDataFx } from "@/shared/init";
import { UseFormReturn } from "react-hook-form";

export const $formMethods = createStore(null);

export const submitSignin = createEvent<SigninFormSchema>();
export const formMethodsApiChanged = createEvent<UseFormReturn<SigninFormSchema>>();

sample({
	clock: formMethodsApiChanged,
	source: $formMethods,
});

export const signInFx = createEffect(async (values: SigninFormSchema) => {
	const res = await signIn(values);

	if (!res.sessionId) {
		throw new Error("smth went wrong, please try again");
	}

	const result = await initUserDataFx();
	return result;
});

sample({
	clock: submitSignin,
	target: signInFx,
});

signInFx.fail.watch(({ error }) => {
	console.error("failed to signin", error);
});

signInFx.done.watch(({ result }) => {
	const { workspace } = result;

	router.push("projects", { workspaceId: String(workspace.id) });
});
