import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

import { BaseResponse } from "~types/responses";
import {
	CreateFolderServiceInput,
	CreateTaskServiceInput,
	GetMeServiceResult,
	GetProjectMembersSearch,
	GetProjectsService,
	SigninServiceResult,
	SignupServiceInput,
	SignupServiceResult,
} from "~types/services";
import transformAxiosError from "../utils/transformAxiosError";
import { TCLient, TNode, TProject, TTimeEntry, TUser } from "~types/models";

type Sorting = {
	by: string;
	asc: boolean;
};

type GetParams = Record<string, unknown>;

const addSorting = (params: GetParams, sorting: Sorting | undefined) => {
	if (sorting) {
		params.sortBy = sorting.by;
		params.sortAsc = sorting.asc;
	}
};

class ApiClient {
	#axios: AxiosInstance;
	#workspaceId: number | null = null;

	constructor() {
		this.#axios = axios.create({
			baseURL: import.meta.env.VITE_API_URL,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	setSessionId(sessionId: string | null) {
		if (!sessionId) {
			delete this.#axios.defaults.headers.common["Authorization"];
			return;
		}
		this.#axios.defaults.headers.common["Authorization"] = `Bearer ${sessionId}`;
	}

	setWorkspaceId(workspaceId: number) {
		this.#workspaceId = workspaceId;
	}

	request = async <T>(
		method: "GET" | "POST" | "PUT" | "DELETE",
		endpoint: string,
		options?: AxiosRequestConfig
	): Promise<BaseResponse<T>> => {
		try {
			const res: AxiosResponse<BaseResponse<T>> = await this.#axios({
				method,
				url: `/v1${endpoint}`,
				...options,
			});

			return res.data;
		} catch (err: unknown) {
			if (err instanceof AxiosError) {
				throw transformAxiosError(err);
			}
			throw err;
		}
	};

	getMe = async (lastUsedWorkspaceId?: number): Promise<GetMeServiceResult> => {
		const res = await this.request<GetMeServiceResult>("GET", `/me`, {
			params: {
				workspaceId: lastUsedWorkspaceId,
			},
		});
		console.log(res);
		return res.data;
	};

	signIn = async (email: string, password: string): Promise<SigninServiceResult> => {
		const res = await this.request<SigninServiceResult>("POST", `/signin`, {
			data: {
				email,
				password,
			},
		});
		return res.data;
	};

	signUp = async (data: SignupServiceInput): Promise<SignupServiceResult> => {
		const res = await this.request<SignupServiceResult>("POST", `/signup`, {
			data,
		});

		return res.data;
	};

	//*users

	getUsers = async (): Promise<TUser> => {
		const res = await this.request<TUser>("GET", `/${this.#workspaceId}/users`);

		return res.data;
	};

	getUsersForProject = async () => {
		const res = await this.request<TUser>("GET", `/${this.#workspaceId}/users`);

		return res.data;
	};

	//*projects
	getProjects = async (
		filter?: { archived?: boolean },
		sorting?: Sorting
	): Promise<GetProjectsService.ProjectItem[]> => {
		const params: Record<string, unknown> = {};
		if (filter) {
			params.archived = filter.archived;
		}
		addSorting(params, sorting);
		const res = await this.request<GetProjectsService.ProjectItem[]>(
			"GET",
			`/${this.#workspaceId}/projects`,
			{
				params,
			}
		);

		console.log(res.data);
		return res.data;
	};

	getProjectNodes = async (projectId: string, params: { q: string }) => {
		const res = await this.request<TNode[]>(
			"GET",
			`/${this.#workspaceId}/projects/${projectId}/nodes`,
			{
				params,
			}
		);

		return res.data;
	};

	getTimeEntriesProject = async (
		projectId: string,
		params?: { q?: string; limit?: number; offset?: number }
	) => {
		const res = await this.request<TTimeEntry[]>(
			"GET",
			`/${this.#workspaceId}/projects/${projectId}/time-entries`,
			{
				params,
			}
		);

		return res.data;
	};

	createProject = async (data: unknown): Promise<TProject> => {
		const res = await this.request<TProject>("POST", `/${this.#workspaceId}/projects`, {
			data,
		});
		return res.data;
	};

	updateProject = async (projectId: string, data: unknown): Promise<TProject> => {
		const res = await this.request<TProject>("PUT", `/${this.#workspaceId}/projects/${projectId}`, {
			data,
		});
		return res.data;
	};

	getOneProject = async (projectId: string): Promise<TProject> => {
		const res = await this.request<TProject>("GET", `/${this.#workspaceId}/projects/${projectId}`);

		return res.data;
	};

	getProjectMembersSearch = async (search: string): Promise<GetProjectMembersSearch.Member[]> => {
		const res = await this.request<GetProjectMembersSearch.Member[]>(
			"GET",
			`/${this.#workspaceId}/projects/members/search`,
			{
				params: {
					search,
				},
			}
		);

		return res.data;
	};

	//*clients

	getClients = async (search: string) => {
		const res = await this.request<TCLient[]>("GET", `/${this.#workspaceId}/clients`, {
			params: {
				searchText: search,
			},
		});

		return res.data;
	};

	//*node

	moveNode = async (
		nodeId: string,
		{ order, parentId }: { order?: number; parentId?: string | null }
	) => {
		const res = await this.request<TNode>("PUT", `/${this.#workspaceId}/nodes/${nodeId}/move`, {
			data: {
				order,
				parentId,
			},
		});
		console.log("get res node", res.data);
		return res.data;
	};

	markTaskAsCompleted = async (taskId: string) => {
		const res = await this.request<TNode>("PUT", `/${this.#workspaceId}/tasks/${taskId}/complete`);
		return res.data;
	};

	createTask = async (data: CreateTaskServiceInput) => {
		const res = await this.request<TNode>("POST", `/${this.#workspaceId}/tasks`, {
			data,
		});
		return res.data;
	};

	createFolder = async (data: CreateFolderServiceInput) => {
		const res = await this.request<TNode>("POST", `/${this.#workspaceId}/folders`, {
			data,
		});
		return res.data;
	};

	deleteNode = async (nodeId: string): Promise<TNode> => {
		const res = await this.request<TNode>("DELETE", `/${this.#workspaceId}/nodes/${nodeId}`);
		return res.data;
	};
}

export default new ApiClient();
