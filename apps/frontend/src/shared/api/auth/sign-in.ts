import { apiClient } from "../../api";

export type SigninResponse = {
	sessionId: string;
};

type Data = { email: string; password: string };

export const signIn = async ({ email, password }: Data): Promise<SigninResponse> => {
	const res = await apiClient.request<SigninResponse>("POST", `/auth/signin`, {
		data: {
			email,
			password,
		},
	});

	return res;
};
