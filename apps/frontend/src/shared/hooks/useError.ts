import { useCallback, useState } from "react";
import { transformAxiosError } from "@/shared/utils";
import { AxiosError } from "axios";
import { InputError, ApiError } from "@/shared/api";
import InputErrorFields from "@/shared/types/InputErrorFields";

const useError = (errorTranslationMap?: Record<string, string>) => {
	const [error, setError] = useState<string | null>(null);
	const [inputErrorFields, setInputErrorFields] = useState<InputErrorFields | null>(null);

	const handleError = useCallback(
		(anyError: unknown) => {
			let err: Error | ApiError | InputError | null = null;
			if (anyError instanceof AxiosError) {
				err = transformAxiosError(anyError);
			} else if (anyError instanceof Error) {
				err = anyError;
			}

			if (err instanceof InputError) {
				setInputErrorFields(err.fields);
				return;
			}
			if (err instanceof ApiError || err instanceof Error) {
				const translatedError = errorTranslationMap?.[err.message];
				setError(translatedError || err.message);
			}
		},
		[errorTranslationMap]
	);

	const resetError = useCallback(() => {
		setError(null);
		setInputErrorFields(null);
	}, []);

	return { error, inputErrorFields, handleError, resetError };
};

export default useError;
