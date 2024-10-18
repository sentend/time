import capitalize from "lodash/capitalize";

export default (fieldName: string, error: string) => {
	const fieldNameT: Record<string, string> = {
		name: "name",
		desc: "description",
		email: "email",
		password: "password",
	};

	const errorT: Record<string, string> = {
		Required: "Please enter %s",
		isRequired: "Please enter %s",
		cannotBeEmpty: "%s cannot be empty",
		isInvalid: "%s is invalid",
		mustBeNumber: "%s must be a number",
		duplicate: "%s is already in use",
		cannotBeInFuture: "%s cannot be in the future",
		passwordsDontMatch: "Passwords don't match",
	};

	const translatedField = fieldNameT[fieldName] || fieldName;
	const translatedError = errorT[error] || error;
	const shouldCapitalize = translatedError.startsWith("%s");
	const effectiveFieldName = shouldCapitalize ? capitalize(translatedField) : translatedField;
	return translatedError.replace("%s", effectiveFieldName);
	return error;
};
