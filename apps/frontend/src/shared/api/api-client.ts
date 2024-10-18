import axios, {
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
	type AxiosError,
	type InternalAxiosRequestConfig,
} from "axios";

import { API_URL } from "@/shared/config";

export type BaseResponse<T> = {
	status: 1;
	responseCode: number;
	data: T;
};

export type ErrorResponse = {
	status: 0;
	message: string;
	code: string;
	cause: string;
};

class ApiClient {
	private client: AxiosInstance;

	constructor(baseURL: string) {
		this.client = axios.create({
			baseURL,
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		});

		// this.client.interceptors.request.use(this.beforeRequest, this.handleRequestError);

		// this.client.interceptors.response.use((response) => response, this.handleResponseError);
	}

	public request = async <T>(
		method: "GET" | "POST" | "PUT" | "DELETE",
		endpoint: string,
		options?: AxiosRequestConfig
	) => {
		const url = `${endpoint}`;

		const response: AxiosResponse<BaseResponse<T>> = await this.client({
			method,
			url,
			...options,
		});

		return this.handleResponse(response);
	};

	private handleResponse = <T>(response: AxiosResponse<BaseResponse<T> | ErrorResponse>) => {
		console.log("handler response", response);

		if (response.data.status === 0) {
			throw new Error(`Server error: ${response.data.status} - ${response.data.message}`);
		}

		return response.data.data;
	};

	private handleRequestError = (error: AxiosError): Promise<never> => {
		console.error("Request error:", error);
		return Promise.reject(error);
	};

	// Обработка ошибки ответа
	private handleResponseError = (error: AxiosError): Promise<never> => {
		console.error("Response error:", error);
		if (error.response?.status === 401) {
			console.error("Unauthorized user");
		}
		return Promise.reject(error);
	};

	private beforeRequest = (config: InternalAxiosRequestConfig) => {
		return config;
	};
}

const apiClient = new ApiClient(API_URL);

export { apiClient };
