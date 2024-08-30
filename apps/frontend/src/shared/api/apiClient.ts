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
import { TCLient, TTimeEntry } from "~types/models";
import type { UserDTO } from "@/server/user";
import type { NodeModel } from "@/server/node";
import type { ProjectDTO } from "@/server/project";

class ApiClient {
	private client: AxiosInstance;
	private workspaceId: number | null = null;
	private sessionId: string | null = "";

	constructor(baseURL: string) {
		this.client = axios.create({
			baseURL,
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		});

		this.client.interceptors.request.use(
			(config) => {
				const token = `Bearer ${this.sessionId}`;
				console.log(config.headers["User-Agent"]);
				config.headers["Authorization"] = token;

				return config;
			},
			(error) => {
				console.error("API request failed:", error);
				return Promise.reject(error);
			}
		);

		this.client.interceptors.response.use(
			(response) => response,
			(error) => {
				console.error("API response failed:", error);
				if (error.response && error.response.status === 401) {
					console.error("UNAUTH user");
				}
				return Promise.reject(error);
			}
		);
	}

	setSessionId(sessionId: string | null) {
		this.sessionId = sessionId;
	}

	setWorkspaceId(workspaceId: number) {
		this.workspaceId = workspaceId;
	}

	request = async <T>(
		method: "GET" | "POST" | "PUT" | "DELETE",
		endpoint: string,
		options?: AxiosRequestConfig
	): Promise<BaseResponse<T>> => {
		const url = `${endpoint}`;

		try {
			const res: AxiosResponse<BaseResponse<T>> = await this.client({
				method,
				url,
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
		console.log("ge me result", res);
		return res.data;
	};

	signIn = async (email: string, password: string): Promise<SigninServiceResult> => {
		const res = await this.request<SigninServiceResult>("POST", `/auth/signin`, {
			data: {
				email,
				password,
			},
		});
		return res.data;
	};

	signUp = async (data: SignupServiceInput): Promise<SignupServiceResult> => {
		const res = await this.request<SignupServiceResult>("POST", `/auth/signup`, {
			data,
		});

		return res.data;
	};

	//*users

	getUsers = async (): Promise<UserDTO> => {
		const res = await this.request<UserDTO>("GET", `/${this.workspaceId}/users`);

		return res.data;
	};

	getUsersForProject = async (workspaceId: number) => {
		const res = await this.request<UserDTO>("GET", `/${workspaceId}/users`);

		return res.data;
	};

	//*projects

	getProjectNodes = async (projectId: string, params: { q: string }) => {
		const res = await this.request<NodeModel[]>(
			"GET",
			`/${this.workspaceId}/projects/${projectId}/nodes`,
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
			`/${this.workspaceId}/projects/${projectId}/time-entries`,
			{
				params,
			}
		);

		return res.data;
	};

	createProject = async (workspaceId: number, data: unknown): Promise<ProjectDTO> => {
		const res = await this.request<ProjectDTO>("POST", `/${workspaceId}/projects`, {
			data,
		});
		return res.data;
	};

	updateProject = async (projectId: string, data: unknown): Promise<ProjectDTO> => {
		const res = await this.request<ProjectDTO>(
			"PUT",
			`/${this.workspaceId}/projects/${projectId}`,
			{
				data,
			}
		);
		return res.data;
	};

	getOneProject = async (projectId: string): Promise<ProjectDTO> => {
		const res = await this.request<ProjectDTO>("GET", `/${this.workspaceId}/projects/${projectId}`);

		return res.data;
	};

	getProjectMembersSearch = async (search: string): Promise<GetProjectMembersSearch.Member[]> => {
		const res = await this.request<GetProjectMembersSearch.Member[]>(
			"GET",
			`/${this.workspaceId}/projects/members/search`,
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
		const res = await this.request<TCLient[]>("GET", `/${this.workspaceId}/clients`, {
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
		const res = await this.request<NodeModel>("PUT", `/${this.workspaceId}/nodes/${nodeId}/move`, {
			data: {
				order,
				parentId,
			},
		});
		console.log("get res node", res.data);
		return res.data;
	};

	markTaskAsCompleted = async (taskId: string) => {
		const res = await this.request<NodeModel>(
			"PUT",
			`/${this.workspaceId}/tasks/${taskId}/complete`
		);
		return res.data;
	};

	createTask = async (data: CreateTaskServiceInput) => {
		const res = await this.request<NodeModel>("POST", `/${this.workspaceId}/tasks`, {
			data,
		});
		return res.data;
	};

	createFolder = async (data: CreateFolderServiceInput) => {
		const res = await this.request<NodeModel>("POST", `/${this.workspaceId}/folders`, {
			data,
		});
		return res.data;
	};

	deleteNode = async (nodeId: string): Promise<NodeModel> => {
		const res = await this.request<NodeModel>("DELETE", `/${this.workspaceId}/nodes/${nodeId}`);
		return res.data;
	};
}

const apiClient = new ApiClient(`/api/v1`);

export { apiClient };
