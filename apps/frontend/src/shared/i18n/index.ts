import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import { en } from "./locales/en";

export const defaultNS = "translation";

export const resources = {
	en
} as const;

export default i18next.use(initReactI18next).init({
	lng: "en", // if you're using a language detector, do not define the lng option
	debug: true,
	fallbackLng: "en",
	defaultNS,
	resources
});
