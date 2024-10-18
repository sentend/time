import { FieldErrors, FieldValues } from "react-hook-form";
import InputErrorFields from "../types/InputErrorFields";

const combineInputErrors = <T extends FieldErrors>(
	formErrors: T,
	touchedFields: Record<string, unknown> | undefined,
	inputErrorFields: InputErrorFields | null
): Record<keyof T, string> => {
	const effectiveErrors: Record<keyof T, string> = {};
	if (formErrors) {
		for (const field in formErrors) {
			if (touchedFields && !touchedFields[field]) {
				continue;
			}
			const error = formErrors[field];
			console.log("ERROR======>", error);
			if (error) {
				effectiveErrors[field] = error.message as string;
			}
		}
	}
	if (inputErrorFields) {
		Object.assign(effectiveErrors, inputErrorFields);
	}
	return effectiveErrors;
};

export default combineInputErrors;
