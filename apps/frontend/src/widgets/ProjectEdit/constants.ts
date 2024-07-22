import { TFunction } from "i18next";

export const getTypeBudgetSegments = (
	t: TFunction<"translation", undefined>,
	isBillable: boolean
) => [
	{
		name: t("project.budgetType.revenue"),
		value: 1,
		disabled: !isBillable,
		disabledContent: t("project.budgetType.disabledContent"),
	},

	{ name: t("project.budgetType.trackedTime"), value: 2 },
];

export const getIntervalBudgetSegments = (t: TFunction<"translation", undefined>) => {
	return [
		{ name: t("month"), value: 1 },
		{ name: t("quartal"), value: 2 },
		{ name: t("year"), value: 3 },
	];
};
