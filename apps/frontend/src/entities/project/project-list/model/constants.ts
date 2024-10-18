import i18next from "i18next";

export const BUDGET_TYPE = {
	REVENUE: 1,
	TRACKED_TIME: 2,
};

export const BUDGET_INTERVAL = {
	MONTH: i18next.t("month"),
	QUARTAL: i18next.t("quartal"),
	YEAR: i18next.t("year"),
} as const;
