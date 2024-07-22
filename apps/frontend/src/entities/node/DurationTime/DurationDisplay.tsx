import { Text } from "@/shared/ui";
import { TextProps } from "@/shared/ui/text/Text";
import { cn, getDuration } from "@/shared/utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type DurationProps = {
	duration: number;
	className?: string;
	formatTemplate?: number;
} & TextProps;

const DurationDisplay = ({ duration, formatTemplate = 0, className, ...props }: DurationProps) => {
	const { t } = useTranslation();

	const formats = useMemo(
		() => [
			`$hours ${t("time.h")} $minutes ${t("time.m")}`,
			`$hours ${t("time.h")}`,
			`$hours ${t("time.h")}:$minutes ${t("time.m")}`,
			`$hours ${t("time.h")}:$minutes ${t("time.m")}:$seconds ${t("time.s")}`,
			"$hours :$minutes ",
		],
		[t]
	);

	const formatDuration = (duration: number, template: number) => {
		const durationTime = getDuration(duration);

		const regexp = new RegExp(/(\$.\w*)/, "gi");
		const durationKeys = Object.keys(durationTime) as Array<keyof typeof durationTime>;

		let result = formats[template]!;

		result?.match(regexp)?.forEach((item) => {
			const key = durationKeys.find((key) => key === item.slice(1))!;
			const value = String(durationTime[key]);
			result = result.replace(`${item} `, `${value}`);
		});
		return result;
	};

	const effectiveDuration = formatDuration(duration, formatTemplate);

	return (
		<Text variant={"secondary"} className={cn("", className)} {...props}>
			{effectiveDuration}
		</Text>
	);
};

export default DurationDisplay;
