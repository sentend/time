import { AxiosError } from "axios";
import ApiError from "../api/ApiError";
import InputError from "../api/InputError";

const transformAxiosError = (err: AxiosError): Error | ApiError | InputError => {
	if (err.response) {
		const { status, data } = err.response;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const anyData = data as any;
		const message = anyData?.message || err.message;
		const userInfo = anyData?.userInfo;
		const fields = anyData?.fields;

		if (fields) {
			return new InputError(fields, userInfo);
		}

		if (message) {
			return new ApiError(message, status, userInfo);
		}
	}
	return err;
};

export default transformAxiosError;
