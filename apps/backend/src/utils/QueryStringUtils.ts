import { ParsedQs } from "qs";
import ApiError from "./ApiError";
import stringUppercaseFirstLetter from "./stringUppercaseFirstLetter";
import isString from "lodash/isString";
import isArray from "lodash/isArray";
import isBoolean from "lodash/isBoolean";

export const parseQSToDate = (
	value: undefined | string | string[] | ParsedQs | ParsedQs[],
	paramName: string,
): Date | undefined => {
	if (value === undefined || value === null) {
		return undefined;
	}
	if (Array.isArray(value)) {
		throw new ApiError(`InvalidParam${stringUppercaseFirstLetter(paramName)}`, 409);
	}
	const ts = parseInt(String(value), 10);
	return new Date(ts);
};

export const parseQSToStringArray = (
	value: undefined | string | string[] | ParsedQs | ParsedQs[],
	paramName?: string,
): string[] | undefined => {
	if (value === undefined || value === null) {
		return undefined;
	}
	if (isString(value)) {
		return [value];
	}
	if (!Array.isArray(value)) {
		const errorMessage =
			paramName !== undefined
				? `InvalidParam${stringUppercaseFirstLetter(paramName)}`
				: "InvalidParam";
		throw new ApiError(errorMessage, 409);
	}
	return (value as any[]).map(item => String(item));
};

export const parseQSToIntArray = (
	value: undefined | string[] | ParsedQs | ParsedQs[],
	paramName?: string,
): number[] | undefined => {
	if (value === undefined || value === null) {
		return undefined;
	}
	if (!Array.isArray(value)) {
		const errorMessage =
			paramName !== undefined
				? `InvalidParam${stringUppercaseFirstLetter(paramName)}`
				: "InvalidParam";
		throw new ApiError(errorMessage, 409);
	}
	return (value as any[]).map(item => parseInt(item));
};

export const parseQSToInt = (
	value: undefined | string | string[] | ParsedQs | ParsedQs[],
): number | undefined => {
	const parsed = parseInt(value as string, 10);
	return !isNaN(parsed) ? parsed : undefined;
};

export const parseQSToBoolean = (
	value: undefined | string | string[] | ParsedQs | ParsedQs[],
): boolean | undefined => {
	if (isArray(value)) {
		return undefined;
	}
	if (isBoolean(value)) {
		return value;
	}

	const trueValues = ["yes", "true", "y", "1"];
	const falseValues = ["no", "false", "n", "0"];

	const strValue = String(value).toLocaleLowerCase().trim();
	if (trueValues.includes(strValue)) {
		return true;
	} else if (falseValues.includes(strValue)) {
		return false;
	}

	return undefined;
};
