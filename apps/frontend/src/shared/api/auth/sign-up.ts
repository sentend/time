import { apiClient } from "@/shared/api";

type SignupResponse = {
	sessionId: string;
};

type SignupInputData = {
	name: string;
	email: string;
	password: string;
	workspaceName?: string;
};

export const signUp = async (data: SignupInputData) => {
	const res = await apiClient.request<SignupResponse>("POST", `/auth/signup`, {
		data,
	});

	return res;
};
